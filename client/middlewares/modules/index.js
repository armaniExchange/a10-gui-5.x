
export function moduletest(module, license) {
  if (!license.adc && module.path === 'adc') return false;
  return true;
}
