import colorNamed from '@tinyfe/color-keywords';
import { Profile } from 'src/typings';

export default function getSomethings(options: Profile) {
  console.log(options, colorNamed, options.name);
}
