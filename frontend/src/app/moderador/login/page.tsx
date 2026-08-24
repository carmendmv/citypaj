import { redirect } from 'next/navigation';

export default function ModeradorLoginPage() {
  redirect('/admin/acceder?returnTo=/moderador');
}
