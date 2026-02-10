export class SlugService {
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  static async generateUniqueSlug(
    name: string,
    userId: string,
    existsCheck: (slug: string, userId: string) => Promise<boolean>
  ): Promise<string> {
    const baseSlug = SlugService.generateSlug(name);
    let slug = baseSlug;
    let suffix = 2;

    while (await existsCheck(slug, userId)) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    return slug;
  }
}
