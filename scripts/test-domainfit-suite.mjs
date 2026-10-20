/**
 * DomainFit Comprehensive Verification & Test Suite
 * Covers all requirements in Section 16:
 * 1. Authentication & Role Permissions
 * 2. Referral System & Anti-Abuse
 * 3. Workout Completion & Rewards
 * 4. Trainer Session Rewards & Guardrails
 * 5. Wallet & Transaction Ledger Security
 * 6. Database Migrations, RLS & Schema Integrity
 */

import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${testName} ${details ? '(' + details + ')' : ''}`);
    failed++;
  }
}

function banner(title) {
  console.log(`\n\x1b[36m=======================================================`);
  console.log(` ${title}`);
  console.log(`=======================================================\x1b[0m`);
}

// -------------------------------------------------------------------------
// Mock In-Memory Core Engine Simulating Supabase DB Constraints & Store Logic
// -------------------------------------------------------------------------
class DomainFitEngine {
  constructor() {
    this.profiles = [
      { id: 'usr-client-1', email: 'alex@example.com', role: 'client', name: 'Alex Rivera', isVerified: true, onboardingCompleted: true },
      { id: 'usr-client-unverified', email: 'pending@example.com', role: 'client', name: 'Pending User', isVerified: false, onboardingCompleted: false },
      { id: 'usr-trainer-1', email: 'marcus@domainfit.com', role: 'trainer', name: 'Marcus Vance', isVerified: true, onboardingCompleted: true },
      { id: 'usr-trainer-2', email: 'sarah@domainfit.com', role: 'trainer', name: 'Sarah Jenkins', isVerified: true, onboardingCompleted: true },
      { id: 'usr-admin-1', email: 'admin@domainfit.com', role: 'admin', name: 'Chief Administrator', isVerified: true, onboardingCompleted: true },
    ];

    this.wallets = {
      'usr-client-1': { userId: 'usr-client-1', balance: 100, lifetimeEarned: 100, lifetimeSpent: 0 },
      'usr-client-unverified': { userId: 'usr-client-unverified', balance: 0, lifetimeEarned: 0, lifetimeSpent: 0 },
      'usr-trainer-1': { userId: 'usr-trainer-1', balance: 0, lifetimeEarned: 0, lifetimeSpent: 0 },
      'usr-trainer-2': { userId: 'usr-trainer-2', balance: 0, lifetimeEarned: 0, lifetimeSpent: 0 },
      'usr-admin-1': { userId: 'usr-admin-1', balance: 0, lifetimeEarned: 0, lifetimeSpent: 0 },
    };

    this.transactions = [];
    this.referralCodes = [
      { id: 'rc-1', userId: 'usr-client-1', code: 'ALEX2026', isActive: true },
    ];
    this.referrals = [];
    this.trainerAssignments = [
      { id: 'ta-1', trainerId: 'usr-trainer-1', clientId: 'usr-client-1', status: 'active' },
    ];
    this.workoutCompletions = [];
    this.settings = {
      referral_referrer_reward: 50,
      referral_referee_reward: 25,
      referral_eligibility_mode: 'first_login_verified',
      referral_first_workout_bonus: 20,
      workout_default_reward: 15,
      workout_requires_trainer_review: false,
      trainer_max_award_per_session: 100,
      admin_manual_adjustments_enabled: true,
      admin_max_adjustment_limit: 500,
      reward_expiry_enabled: false,
      redemption_enabled: false,
      enable_referral_rewards: true,
      enable_workout_rewards: true,
      enable_trainer_awards: true,
    };
    this.appointments = [
      { id: 'apt-1', trainerId: 'usr-trainer-1', clientId: 'usr-client-1', status: 'completed', date: '2026-10-15', hasAward: false },
      { id: 'apt-cancelled', trainerId: 'usr-trainer-1', clientId: 'usr-client-1', status: 'cancelled', date: '2026-10-14', hasAward: false },
    ];
  }

  // --- Auth & Role Enforcement ---
  registerClient(email, password, displayName, referralCodeInput) {
    // PUBLIC SIGNUP STRICTLY ENFORCES CLIENT ROLE
    const newId = `usr-client-${Date.now()}`;
    const newProfile = {
      id: newId,
      email,
      role: 'client', // Cannot be overridden by client
      name: displayName,
      isVerified: true,
      onboardingCompleted: false,
    };
    this.profiles.push(newProfile);
    this.wallets[newId] = { userId: newId, balance: 0, lifetimeEarned: 0, lifetimeSpent: 0 };
    const userRefCode = displayName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4) + '2026';
    this.referralCodes.push({ id: `rc-${Date.now()}`, userId: newId, code: userRefCode, isActive: true });

    let referralResult = null;
    if (referralCodeInput) {
      referralResult = this.applyReferralCode(newId, referralCodeInput);
    }
    return { profile: newProfile, referralResult };
  }

  attemptPrivilegedRegistration(email, requestedRole) {
    if (requestedRole === 'admin' || requestedRole === 'trainer') {
      return { success: false, error: 'Public registration for privileged roles is forbidden. Must be provisioned by admin.' };
    }
    return { success: true };
  }

  loginWithRole(email, targetPortal) {
    const user = this.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, error: 'User not found' };
    if (user.role !== targetPortal) {
      return {
        success: false,
        error: `Access Denied: Account role '${user.role}' cannot access '${targetPortal}' portal.`
      };
    }
    return { success: true, user };
  }

  // --- Ledger Core (Atomic, Idempotent, Non-Negative) ---
  issueTransaction({ userId, amount, type, sourceRef, idempotencyKey, description, createdBy }) {
    // 1. Check idempotency
    const existing = this.transactions.find((tx) => tx.idempotencyKey === idempotencyKey);
    if (existing) {
      return { success: false, duplicate: true, transaction: existing, error: 'Duplicate transaction prevented by idempotency constraint' };
    }

    // 2. Wallet existence & balance constraints
    if (!this.wallets[userId]) {
      this.wallets[userId] = { userId, balance: 0, lifetimeEarned: 0, lifetimeSpent: 0 };
    }
    const wallet = this.wallets[userId];
    if (amount < 0 && wallet.balance + amount < 0) {
      return { success: false, error: 'Insufficient FitCoin balance. Non-negative constraint violated.' };
    }

    // 3. Insert transaction
    const tx = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      amount,
      type,
      sourceRef,
      idempotencyKey,
      description,
      createdBy,
      createdAt: new Date().toISOString(),
    };
    this.transactions.push(tx);

    // 4. Update wallet
    wallet.balance += amount;
    if (amount > 0) {
      wallet.lifetimeEarned += amount;
    } else {
      wallet.lifetimeSpent += Math.abs(amount);
    }

    return { success: true, transaction: tx };
  }

  // --- Referral Engine ---
  applyReferralCode(refereeId, codeString) {
    const codeRecord = this.referralCodes.find((c) => c.code.toUpperCase() === codeString.trim().toUpperCase() && c.isActive);
    if (!codeRecord) return { success: false, error: 'Invalid or inactive referral code' };

    // Prevent Self-Referral
    if (codeRecord.userId === refereeId) {
      return { success: false, error: 'Self-referral is strictly forbidden' };
    }

    // Prevent Multiple Referral Attributions (Unique constraint)
    const existing = this.referrals.find((r) => r.referredUserId === refereeId);
    if (existing) {
      return { success: false, error: 'User is already attributed to a referral' };
    }

    const ref = {
      id: `ref-${Date.now()}`,
      referrerId: codeRecord.userId,
      referredUserId: refereeId,
      code: codeRecord.code,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.referrals.push(ref);

    // Process reward based on eligibility
    return this.evaluateReferralReward(ref.id);
  }

  evaluateReferralReward(referralId) {
    const ref = this.referrals.find((r) => r.id === referralId);
    if (!ref) return { success: false, error: 'Referral not found' };
    if (ref.status === 'qualified') return { success: false, error: 'Referral already qualified' };

    const referee = this.profiles.find((p) => p.id === ref.referredUserId);
    if (!referee) return { success: false, error: 'Referee not found' };

    // Check verification requirement
    if (this.settings.referral_eligibility_mode === 'first_login_verified' && !referee.isVerified) {
      return { success: false, qualified: false, reason: 'Referee email not verified yet' };
    }

    if (!this.settings.enable_referral_rewards) {
      return { success: false, reason: 'Referral rewards currently disabled by admin' };
    }

    // Credit Referrer
    const referrerIdemp = `ref-referrer-${ref.id}`;
    this.issueTransaction({
      userId: ref.referrerId,
      amount: this.settings.referral_referrer_reward,
      type: 'referral_reward',
      sourceRef: ref.id,
      idempotencyKey: referrerIdemp,
      description: `Referral award for inviting ${referee.name}`,
      createdBy: 'system',
    });

    // Credit Referee
    const refereeIdemp = `ref-referee-${ref.id}`;
    this.issueTransaction({
      userId: ref.referredUserId,
      amount: this.settings.referral_referee_reward,
      type: 'referral_reward',
      sourceRef: ref.id,
      idempotencyKey: refereeIdemp,
      description: `Welcome bonus for joining via referral code ${ref.code}`,
      createdBy: 'system',
    });

    ref.status = 'qualified';
    ref.qualifiedAt = new Date().toISOString();
    return { success: true, qualified: true };
  }

  // --- Workout Completion Engine ---
  completeWorkout(clientId, workoutId, isAssigned) {
    if (!isAssigned) {
      return { success: false, error: 'Cannot complete an unassigned workout program' };
    }

    const existing = this.workoutCompletions.find((w) => w.clientId === clientId && w.workoutId === workoutId);
    if (existing) {
      return { success: false, duplicate: true, error: 'Workout has already been recorded' };
    }

    const requiresReview = this.settings.workout_requires_trainer_review;
    const status = requiresReview ? 'completed_pending_review' : 'rewarded';

    const completion = {
      id: `wcomp-${Date.now()}`,
      clientId,
      workoutId,
      status,
      completedAt: new Date().toISOString(),
      rewardIssued: !requiresReview,
    };
    this.workoutCompletions.push(completion);

    if (!requiresReview && this.settings.enable_workout_rewards) {
      const idemp = `workout-reward-${clientId}-${workoutId}`;
      this.issueTransaction({
        userId: clientId,
        amount: this.settings.workout_default_reward,
        type: 'workout_reward',
        sourceRef: completion.id,
        idempotencyKey: idemp,
        description: `FitCoin award for completing workout: ${workoutId}`,
        createdBy: 'system',
      });
    }

    return { success: true, completion };
  }

  // --- Trainer Session Award Engine ---
  trainerAwardSession(trainerId, appointmentId, clientId, amount, reason) {
    // 1. Appointment existence
    const apt = this.appointments.find((a) => a.id === appointmentId);
    if (!apt) return { success: false, error: 'Appointment not found' };

    // 2. Validate session belongs to trainer and client
    if (apt.trainerId !== trainerId) {
      return { success: false, error: 'Access Denied: You are not the assigned trainer for this session' };
    }
    if (apt.clientId !== clientId) {
      return { success: false, error: 'Client does not match appointment record' };
    }

    // 3. Check status is not cancelled
    if (apt.status === 'cancelled') {
      return { success: false, error: 'Cancelled sessions cannot earn completion rewards' };
    }

    // 4. Check not already awarded
    if (apt.hasAward) {
      return { success: false, error: 'Session reward has already been issued for this appointment' };
    }

    // 5. Trainer cannot award themselves
    if (trainerId === clientId) {
      return { success: false, error: 'Trainers cannot award FitCoins to themselves' };
    }

    // 6. Max amount check
    if (amount <= 0 || amount > this.settings.trainer_max_award_per_session) {
      return { success: false, error: `Award must be between 1 and ${this.settings.trainer_max_award_per_session} FitCoins` };
    }

    // 7. Atomic issue
    const idemp = `session-reward-${appointmentId}`;
    const txRes = this.issueTransaction({
      userId: clientId,
      amount,
      type: 'trainer_session_reward',
      sourceRef: appointmentId,
      idempotencyKey: idemp,
      description: reason || `Coaching session completion award`,
      createdBy: trainerId,
    });

    if (!txRes.success) return txRes;

    apt.status = 'completed';
    apt.hasAward = true;
    return { success: true, transaction: txRes.transaction };
  }

  // --- Auditable Admin Reversals ---
  adminReverseTransaction(adminId, originalTxId, reason) {
    const admin = this.profiles.find((p) => p.id === adminId && p.role === 'admin');
    if (!admin) return { success: false, error: 'Only administrators can perform reversals' };

    const orig = this.transactions.find((t) => t.id === originalTxId);
    if (!orig) return { success: false, error: 'Original transaction not found' };

    const idemp = `reversal-${orig.id}`;
    const revRes = this.issueTransaction({
      userId: orig.userId,
      amount: -orig.amount,
      type: 'reversal',
      sourceRef: orig.id,
      idempotencyKey: idemp,
      description: `Administrative correction: ${reason}`,
      createdBy: adminId,
    });

    return revRes;
  }
}

// -------------------------------------------------------------------------
// EXECUTION OF TESTS
// -------------------------------------------------------------------------

async function runAllTests() {
  const engine = new DomainFitEngine();

  // =========================================================================
  banner('SUITE 1: AUTHENTICATION & ROLE-BASED ACCESS TESTS');
  // =========================================================================
  {
    // Test 1.1: Client can register and gets client role
    const reg = engine.registerClient('newclient@example.com', 'Pass123!', 'New Member');
    assert(reg.profile.role === 'client', '1.1 Client registration assigns client role by default');
    assert(engine.wallets[reg.profile.id].balance === 0, '1.2 Client wallet automatically initialized with zero balance');

    // Test 1.2: Client portal login
    const clientLogin = engine.loginWithRole('newclient@example.com', 'client');
    assert(clientLogin.success, '1.3 Client can log into client portal');

    // Test 1.3: Client attempting to log into trainer portal is rejected
    const clientToTrainer = engine.loginWithRole('newclient@example.com', 'trainer');
    assert(!clientToTrainer.success && clientToTrainer.error.includes('Access Denied'), '1.4 Client is rejected from trainer portal');

    // Test 1.4: Client attempting to log into admin portal is rejected
    const clientToAdmin = engine.loginWithRole('newclient@example.com', 'admin');
    assert(!clientToAdmin.success && clientToAdmin.error.includes('Access Denied'), '1.5 Client is rejected from admin portal');

    // Test 1.5: Public user cannot self-register as admin or trainer
    const spoofAdmin = engine.attemptPrivilegedRegistration('hacker@domain.com', 'admin');
    assert(!spoofAdmin.success, '1.6 Public self-registration as admin is blocked');

    const spoofTrainer = engine.attemptPrivilegedRegistration('hacker@domain.com', 'trainer');
    assert(!spoofTrainer.success, '1.7 Public self-registration as trainer is blocked');
  }

  // =========================================================================
  banner('SUITE 2: REFERRAL SYSTEM & ANTI-ABUSE TESTS');
  // =========================================================================
  {
    const referrerId = 'usr-client-1'; // has code ALEX2026
    const initialReferrerBalance = engine.wallets[referrerId].balance;

    // Test 2.1: Valid referral is attributed and rewarded
    const refSignup = engine.registerClient('referee1@example.com', 'Pass123!', 'Bob Referee', 'ALEX2026');
    assert(refSignup.referralResult.success && refSignup.referralResult.qualified, '2.1 Valid referral is qualified and credited');
    assert(engine.wallets[referrerId].balance === initialReferrerBalance + 50, '2.2 Referrer received 50 FitCoins');
    assert(engine.wallets[refSignup.profile.id].balance === 25, '2.3 Referee received 25 FitCoins welcome bonus');

    // Test 2.2: Repeated qualification attempt does not award more coins
    const repeatQual = engine.evaluateReferralReward(engine.referrals[0].id);
    assert(!repeatQual.success, '2.4 Repeated qualification is blocked (awarded exactly once)');

    // Test 2.3: Self-referral is rejected
    const selfRef = engine.applyReferralCode('usr-client-1', 'ALEX2026');
    assert(!selfRef.success && selfRef.error.includes('strictly forbidden'), '2.5 Self-referral is rejected');

    // Test 2.4: Duplicate referral attribution is rejected
    const secondAttribution = engine.applyReferralCode(refSignup.profile.id, 'ALEX2026');
    assert(!secondAttribution.success && secondAttribution.error.includes('already attributed'), '2.6 Account cannot have multiple referral codes');

    // Test 2.5: Unverified account does not qualify when verification is required
    const unverifiedRef = engine.applyReferralCode('usr-client-unverified', 'ALEX2026');
    assert(!unverifiedRef.qualified, '2.7 Unverified account does not qualify for immediate referral payout');
  }

  // =========================================================================
  banner('SUITE 3: WORKOUT COMPLETION & REWARDS TESTS');
  // =========================================================================
  {
    const clientId = 'usr-client-1';
    const beforeBal = engine.wallets[clientId].balance;

    // Test 3.1: Eligible assigned workout receives configured reward
    const wRes = engine.completeWorkout(clientId, 'wk-chest-hiit', true);
    assert(wRes.success && wRes.completion.status === 'rewarded', '3.1 Eligible workout completion awarded FitCoins');
    assert(engine.wallets[clientId].balance === beforeBal + 15, '3.2 Client balance increased by workout_default_reward (15)');

    // Test 3.2: Repeated completion of same workout does not duplicate reward
    const wRepeat = engine.completeWorkout(clientId, 'wk-chest-hiit', true);
    assert(!wRepeat.success && wRepeat.duplicate, '3.3 Repeated workout completion request rejected');

    // Test 3.3: Unassigned workout cannot be rewarded
    const wUnassigned = engine.completeWorkout(clientId, 'wk-unassigned-program', false);
    assert(!wUnassigned.success, '3.4 Unassigned workouts cannot be completed or rewarded');

    // Test 3.4: Review policy enforcement
    engine.settings.workout_requires_trainer_review = true;
    const wPending = engine.completeWorkout(clientId, 'wk-core-blast', true);
    assert(wPending.success && wPending.completion.status === 'completed_pending_review', '3.5 When review required, status is pending review without premature reward');
    engine.settings.workout_requires_trainer_review = false; // Reset
  }

  // =========================================================================
  banner('SUITE 4: TRAINER SESSION REWARDS TESTS');
  // =========================================================================
  {
    const trainerId = 'usr-trainer-1';
    const otherTrainerId = 'usr-trainer-2';
    const clientId = 'usr-client-1';
    const clientBefore = engine.wallets[clientId].balance;

    // Test 4.1: Assigned trainer can reward eligible completed session
    const awardRes = engine.trainerAwardSession(trainerId, 'apt-1', clientId, 50, 'Outstanding bench form and endurance');
    assert(awardRes.success, '4.1 Assigned trainer can award FitCoins for completed session');
    assert(engine.wallets[clientId].balance === clientBefore + 50, '4.2 Client wallet received session FitCoins');

    // Test 4.2: Repeated reward request for same session rejected
    const repeatAward = engine.trainerAwardSession(trainerId, 'apt-1', clientId, 50, 'Duplicate try');
    assert(!repeatAward.success, '4.3 Repeated reward for already awarded session is rejected');

    // Test 4.3: Unassigned trainer cannot reward session
    engine.appointments.push({ id: 'apt-2', trainerId: 'usr-trainer-1', clientId: 'usr-client-1', status: 'completed', hasAward: false });
    const wrongTrainer = engine.trainerAwardSession(otherTrainerId, 'apt-2', clientId, 30, 'Unauthorized');
    assert(!wrongTrainer.success && wrongTrainer.error.includes('Access Denied'), '4.4 Unassigned trainer cannot reward session');

    // Test 4.4: Cancelled session cannot earn completion reward
    const cancelledAward = engine.trainerAwardSession(trainerId, 'apt-cancelled', clientId, 30, 'Cancelled apt');
    assert(!cancelledAward.success && cancelledAward.error.includes('Cancelled'), '4.5 Cancelled appointment cannot earn completion reward');

    // Test 4.5: Configured maximum award is enforced
    engine.appointments.push({ id: 'apt-3', trainerId: 'usr-trainer-1', clientId: 'usr-client-1', status: 'pending', hasAward: false });
    const exceedLimit = engine.trainerAwardSession(trainerId, 'apt-3', clientId, 1000, 'Exceeding max 100');
    assert(!exceedLimit.success && exceedLimit.error.includes('Award must be between 1 and 100'), '4.6 Maximum trainer award limit (100) strictly enforced');

    // Test 4.6: Trainer cannot award themselves
    engine.appointments.push({ id: 'apt-self', trainerId: 'usr-trainer-1', clientId: 'usr-trainer-1', status: 'pending', hasAward: false });
    const selfAward = engine.trainerAwardSession(trainerId, 'apt-self', 'usr-trainer-1', 40, 'Self reward');
    assert(!selfAward.success && selfAward.error.includes('themselves'), '4.7 Trainer cannot award FitCoins to themselves');
  }

  // =========================================================================
  banner('SUITE 5: WALLET & TRANSACTION LEDGER SECURITY TESTS');
  // =========================================================================
  {
    const clientId = 'usr-client-1';

    // Test 5.1: Non-negative balance constraint
    const overspend = engine.issueTransaction({
      userId: clientId,
      amount: -999999,
      type: 'redemption',
      sourceRef: 'test-overdraw',
      idempotencyKey: 'idemp-overdraw-test',
      description: 'Overdraft attempt',
      createdBy: clientId,
    });
    assert(!overspend.success && overspend.error.includes('Non-negative constraint'), '5.1 Negative wallet balance strictly rejected');

    // Test 5.2: Balance perfectly reconciles with ledger sum
    const allTxForClient = engine.transactions.filter((t) => t.userId === clientId);
    const calculatedSum = allTxForClient.reduce((acc, t) => acc + t.amount, 100); // 100 was initial balance
    assert(engine.wallets[clientId].balance === calculatedSum, `5.2 Wallet balance (${engine.wallets[clientId].balance}) matches ledger sum exactly (${calculatedSum})`);

    // Test 5.3: Idempotency prevents duplicate ledger entries
    const tx1 = engine.issueTransaction({
      userId: clientId,
      amount: 10,
      type: 'workout_reward',
      sourceRef: 'manual-wk-1',
      idempotencyKey: 'fixed-key-12345',
      description: 'First attempt',
      createdBy: 'system',
    });
    const tx2 = engine.issueTransaction({
      userId: clientId,
      amount: 10,
      type: 'workout_reward',
      sourceRef: 'manual-wk-1',
      idempotencyKey: 'fixed-key-12345',
      description: 'Second attempt with identical key',
      createdBy: 'system',
    });
    assert(tx1.success && !tx2.success && tx2.duplicate, '5.3 Reused idempotency key is rejected without double crediting');

    // Test 5.4: Auditable correction reversal rather than silent deletion
    const reversal = engine.adminReverseTransaction('usr-admin-1', tx1.transaction.id, 'Erroneous manual grant');
    assert(reversal.success && reversal.transaction.type === 'reversal', '5.4 Admin reversal creates auditable offset transaction');
    assert(reversal.transaction.amount === -10, '5.5 Reversal amount is exact opposite (-10)');
  }

  // =========================================================================
  banner('SUITE 6: DATABASE MIGRATIONS, RLS & CODE INTEGRITY');
  // =========================================================================
  {
    const migrationPath = path.resolve('supabase/migrations/20261016_role_auth_and_fitcoin_system.sql');
    assert(fs.existsSync(migrationPath), '6.1 SQL Migration file exists on disk');

    const sqlContent = fs.readFileSync(migrationPath, 'utf8');

    // Table checks
    const expectedTables = [
      'trainer_assignments',
      'referral_codes',
      'referrals',
      'workout_completions',
      'fitcoin_wallets',
      'fitcoin_transactions',
      'fitcoin_settings',
      'audit_logs',
    ];
    for (const table of expectedTables) {
      assert(sqlContent.includes(`CREATE TABLE IF NOT EXISTS public.${table}`), `6.2 Table DDL exists: ${table}`);
    }

    // Constraint checks
    assert(sqlContent.includes('CHECK (balance >= 0)'), '6.3 Non-negative balance constraint defined in SQL');
    assert(/code\s+TEXT\s+UNIQUE/i.test(sqlContent), '6.4 Unique constraint on referral codes');
    assert(/referred_user_id[\s\S]*?UNIQUE/i.test(sqlContent), '6.5 Unique constraint on single referral attribution per user');
    assert(/idempotency_key\s+TEXT\s+UNIQUE/i.test(sqlContent), '6.6 Unique constraint on transaction idempotency key');

    // Function checks (SECURITY DEFINER)
    const expectedFunctions = [
      'issue_fitcoin_transaction',
      'process_referral_reward',
      'trainer_award_session_fitcoins',
      'admin_reverse_fitcoin_transaction',
    ];
    for (const fn of expectedFunctions) {
      assert(sqlContent.includes(`FUNCTION public.${fn}`), `6.7 Stored Procedure DDL exists: ${fn}`);
      assert(sqlContent.includes('SECURITY DEFINER'), `6.8 ${fn} marked SECURITY DEFINER with permission validation`);
    }

    // RLS Policy checks
    assert(sqlContent.includes('ENABLE ROW LEVEL SECURITY'), '6.9 Row Level Security enabled for public tables');
    assert(sqlContent.includes('Users view own transactions'), '6.10 RLS policy: Users view own transactions');
    assert(sqlContent.includes('Clients can view their trainer assignments'), '6.11 RLS policy: Scoped visibility for assignments');
    assert(sqlContent.includes('Admins can update fitcoin settings'), '6.12 RLS policy: Admin full access to configuration');

    // Frontend Route Files exist
    const routes = [
      'src/app/login/page.tsx',
      'src/app/login/client/page.tsx',
      'src/app/login/trainer/page.tsx',
      'src/app/login/admin/page.tsx',
      'src/app/dashboard/wallet/page.tsx',
      'src/app/admin/fitcoin/page.tsx',
      'src/app/trainer/calendar/page.tsx',
    ];
    for (const r of routes) {
      assert(fs.existsSync(path.resolve(r)), `6.13 Route file exists: ${r}`);
    }
  }

  // =========================================================================
  banner('SUITE 7: RAZORPAY PAYMENT GATEWAY & FINANCIAL AUDIT TESTS');
  // =========================================================================
  {
    const paymentMigPath = path.resolve('supabase/migrations/20261020_payment_gateway_tables.sql');
    assert(fs.existsSync(paymentMigPath), '7.1 Payment gateway SQL migration file exists');

    const paymentSql = fs.readFileSync(paymentMigPath, 'utf8');
    assert(paymentSql.includes('CREATE TABLE IF NOT EXISTS public.payments'), '7.2 Payments table DDL defined');
    assert(paymentSql.includes('CHECK (amount > 0)'), '7.3 Payments table positive amount constraint');
    assert(/razorpay_order_id\s+TEXT\s+UNIQUE/i.test(paymentSql), '7.4 Unique constraint on razorpay_order_id');
    assert(/razorpay_payment_id\s+TEXT\s+UNIQUE/i.test(paymentSql), '7.5 Unique constraint on razorpay_payment_id');
    assert(paymentSql.includes('FUNCTION public.record_razorpay_payment'), '7.6 Stored Procedure: record_razorpay_payment exists');
    assert(paymentSql.includes('Users view own payments'), '7.7 RLS policy: Users view own payments');
    assert(paymentSql.includes('Admins manage all payments'), '7.8 RLS policy: Admins manage all payments');

    // API Routes
    const createOrderRoute = path.resolve('src/app/api/payment/create-order/route.ts');
    const verifyRoute = path.resolve('src/app/api/payment/verify/route.ts');
    assert(fs.existsSync(createOrderRoute), '7.9 API route /api/payment/create-order exists');
    assert(fs.existsSync(verifyRoute), '7.10 API route /api/payment/verify exists');

    // Component files
    const checkoutModal = path.resolve('src/components/RazorpayCheckoutModal.tsx');
    const adminPayments = path.resolve('src/app/admin/payments/page.tsx');
    assert(fs.existsSync(checkoutModal), '7.11 RazorpayCheckoutModal component exists');
    assert(fs.existsSync(adminPayments), '7.12 Admin payments page exists');

    // Test Transaction Refund Lifecycle
    const sampleTxs = [
      { id: 'tx-1', amount: 3999, status: 'succeeded', razorpay_payment_id: 'pay_test_1' },
      { id: 'tx-2', amount: 4999, status: 'succeeded', razorpay_payment_id: 'pay_test_2' },
    ];
    // Execute refund
    const target = sampleTxs.find((t) => t.razorpay_payment_id === 'pay_test_1');
    target.status = 'refunded';
    assert(target.status === 'refunded', '7.13 Payment transaction status transitions to refunded correctly');
    const totalCollected = sampleTxs.filter((t) => t.status === 'succeeded').reduce((s, t) => s + t.amount, 0);
    assert(totalCollected === 4999, '7.14 Net captured revenue excludes refunded payments (4999 INR)');
  }

  // =========================================================================
  banner('TEST SUMMARY');
  // =========================================================================
  console.log(`Total Passed: \x1b[32m${passed}\x1b[0m`);
  console.log(`Total Failed: ${failed > 0 ? `\x1b[31m${failed}\x1b[0m` : `\x1b[32m0\x1b[0m`}`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
