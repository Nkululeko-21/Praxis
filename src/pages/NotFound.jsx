import PageHeader from '../components/PageHeader';
import { ButtonLink } from '../components/ui';

/* §32 — "the invoice, the 404 page and the error message are where
   consistency is actually tested." So this page gets the same grid, the
   same index device and the same plain register as everything else. */
export default function NotFound() {
  return (
    <PageHeader
      eyebrow="404"
      title="That page is not here."
      lede="The address may have changed, or it may never have existed. Neither is your problem to solve — here is everything that does exist."
    >
      <div className="mt-10 flex flex-wrap gap-4">
        <ButtonLink to="/">Home</ButtonLink>
        <ButtonLink to="/services" variant="secondary">Services</ButtonLink>
        <ButtonLink to="/how-it-works" variant="secondary">How it works</ButtonLink>
        <ButtonLink to="/audit" variant="secondary">Automation audit</ButtonLink>
      </div>
    </PageHeader>
  );
}
