// 兼容 windows
export function slash(p: string): string {
  return p.replace(/\\/g, '/')
}
