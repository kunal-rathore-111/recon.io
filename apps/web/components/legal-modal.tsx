'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { closeLegalModal } from '@/lib/store/features/legal/legalSlice';
import { RootState } from '@/lib/store/store';
import { useDispatch, useSelector } from 'react-redux';

type LegalSection = {
  heading: string;
  body: string;
};

type LegalContent = {
  title: string;
  sections: LegalSection[];
};

const LEGAL_CONTENT: Record<'terms' | 'privacy', LegalContent> = {
  terms: {
    title: 'Terms of Service',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: 'By accessing and using Universal Data Sentinel, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.',
      },
      {
        heading: '2. Use of Service',
        body: 'You agree to use the service for lawful purposes only and in accordance with these terms. You are prohibited from violating or attempting to violate the security of the Service, including, without limitation, accessing data not intended for such user or logging onto a server or an account which the user is not authorized to access.',
      },
      {
        heading: '3. Data Collection',
        body: 'Our service involves monitoring publicly available web data on your behalf. You are responsible for the URLs you ask us to track and ensuring you have the right to monitor such data. We respect `robots.txt` and other rate-limiting mechanisms.',
      },
      {
        heading: '4. Limitation of Liability',
        body: "We are not liable for any issues arising from your use of this service or changes in target websites. The materials on Recon's website are provided on an 'as is' basis. Recon makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.",
      },
      {
        heading: '5. Modifications',
        body: 'Recon may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      {
        heading: '1. Information We Collect',
        body: 'We collect information you provide directly to us when setting up an account and creating tracking missions. This may include your name, email address, password, and any URLs or parameters you configure for monitoring.',
      },
      {
        heading: '2. How We Use Your Information',
        body: 'We use the information we collect to provide, maintain, and improve our services, and to send you notifications regarding your active missions. We may also use the information to monitor and analyze trends, usage, and activities in connection with our Service.',
      },
      {
        heading: '3. Information Sharing',
        body: 'We do not share your personal information with third parties without your consent, except as required by law. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.',
      },
      {
        heading: '4. Data Security',
        body: 'We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.',
      },
    ],
  },
};

export function LegalModal() {
  const dispatch = useDispatch();
  const { isOpen, content } = useSelector((state: RootState) => state.legal);

  const legalContent = content ? LEGAL_CONTENT[content] : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && dispatch(closeLegalModal())}>
      <DialogContent className="sm:max-w-[650px] h-[85vh] p-0 flex flex-col gap-0 overflow-hidden border-border/50 shadow-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <DialogTitle className="text-xl">{legalContent?.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 min-h-0 px-6 py-6">
          {legalContent && (
            <div className="space-y-8 pb-8 text-sm">
              {legalContent.sections.map((section) => (
                <section key={section.heading}>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                    {section.heading}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{section.body}</p>
                </section>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
