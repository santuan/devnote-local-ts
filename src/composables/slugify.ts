export default function slugify(title: any) {
  return title
    .toLowerCase()
    .replace(/\//g, '-')
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
