export function isNullish(vlaue:any) {
  return vlaue === null || vlaue === undefined;
}


export function isDigitString(str:string) {
  return /^\d+$/.test(str);
}
