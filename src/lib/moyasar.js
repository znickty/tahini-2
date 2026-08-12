export function getCurrentEnvironment() {
  const publishableKey = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY;
  const secretKey = process.env.MOYASAR_SECRET_KEY;
  
  // Determine if we're in test mode based on the key
  const isTest = publishableKey?.startsWith('pk_test_') || false;
  
  return {
    isTest: isTest,
    env: isTest ? 'test' : 'live',
    publishableKey: publishableKey,
    secretKey: secretKey
  };
}

export default {
  getCurrentEnvironment
};