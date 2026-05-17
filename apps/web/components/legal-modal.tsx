'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { closeLegalModal } from '@/lib/store/features/legal/legalSlice';
import { RootState } from '@/lib/store/store';
import { useDispatch, useSelector } from 'react-redux';

export function LegalModal() {
  const dispatch = useDispatch();
  const { isOpen, content } = useSelector((state: RootState) => state.legal);

  const title = content === 'terms' ? 'Terms of Service' : 'Privacy Policy';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && dispatch(closeLegalModal())}>
      <DialogContent className="sm:max-w-[650px] h-[85vh] p-0 flex flex-col gap-0 overflow-hidden border-border/50 shadow-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6 py-6">
          {content === 'terms' && (
            <div className="space-y-8 pb-8 text-sm">
              <section>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">1. Acceptance of Terms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using Universal Data Sentinel, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">2. Use of Service</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to use the service for lawful purposes only and in accordance with these terms. You are prohibited from violating or attempting to violate the security of the Service, including, without limitation, accessing data not intended for such user or logging onto a server or an account which the user is not authorized to access.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">3. Data Collection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our service involves monitoring publicly available web data on your behalf. You are responsible for the URLs you ask us to track and ensuring you have the right to monitor such data. We respect `robots.txt` and other rate-limiting mechanisms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">4. Limitation of Liability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We are not liable for any issues arising from your use of this service or changes in target websites. The materials on Recon's website are provided on an 'as is' basis. Recon makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">5. Modifications</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Recon may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>
            </div>
          )}
          {content === 'privacy' && (
            <div className="space-y-8 pb-8 text-sm">
              <section>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">1. Information We Collect</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We collect information you provide directly to us when setting up an account and creating tracking missions. This may include your name, email address, password, and any URLs or parameters you configure for monitoring.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">2. How We Use Your Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use the information we collect to provide, maintain, and improve our services, and to send you notifications regarding your active missions. We may also use the information to monitor and analyze trends, usage, and activities in connection with our Service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">3. Information Sharing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We do not share your personal information with third parties without your consent, except as required by law. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">4. Data Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                </p>
              </section>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
