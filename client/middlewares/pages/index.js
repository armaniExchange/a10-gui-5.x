
export function partitionCheck(moduleInfo, pageInfo, state) {
  if (pageInfo.path === '/dashboard/slb' && !state.isVCSMaster) {
    return false;
  }
  return true;
}
