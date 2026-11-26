// looksmenu: one brand, a catalogue that serves men's and women's beauty parlours. The file keeps its old
// name and shape so the pages that read the brand name and contact number didn't need renaming.
export interface Shop {
  slug: string;
  name: string;
  /** E.164 format, used for tel: links and wa.me. */
  phone: string;
  /** How the number is shown on screen. */
  phoneDisplay: string;
}

export const shops: Shop[] = [
  {
    slug: 'looksmenu',
    name: 'looksmenu',
    phone: '+9779801033828',
    phoneDisplay: '+977 9801033828',
  },
];

export const defaultShop = shops[0]!;

