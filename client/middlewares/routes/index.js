
export function auth(state, router, appRouteRules) {
  const {
    location: { pathname }
  } = router;
  const { authToken } = state.get('globalVar');
  if (pathname === appRouteRules.CommonAuthLogin && authToken) {
    router.push('/');
    return false;
  } else if (pathname !== appRouteRules.CommonAuthLogin && !authToken) {
    router.push(appRouteRules.CommonAuthLogin);
    return false;
  }
  return true;
}
