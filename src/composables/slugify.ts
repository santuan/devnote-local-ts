const REGEX_SLASH = /\//g
const REGEX_NON_WORD = /[^\w\s-]/g
const REGEX_SPACES = /[\s_-]+/g
const REGEX_LEADING_TRAILING_DASHES = /^-+|-+$/g

export default function slugify(title: any) {
  return title
    .toLowerCase()
    .replace(REGEX_SLASH, '-')
    .trim()
    .replace(REGEX_NON_WORD, '')
    .replace(REGEX_SPACES, '-')
    .replace(REGEX_LEADING_TRAILING_DASHES, '')
}
