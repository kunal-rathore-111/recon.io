'use client';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  Globe,
  Sparkles,
  Tag,
  Eye,
  Cpu,
  Loader2,
  FileText,
  Info,
  CheckCircle2,
  ShoppingBag,
  BlocksIcon,
  Newspaper,
  PlugZap,
  Globe2Icon
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RootState } from '@/lib/store/store';
import { setAddReconReducer } from '@/lib/store/features/addRecon/addReconSlice';
import { FormEvent, startTransition, useActionState, useEffect, useState } from 'react';
import { addReconAction } from '@/app/actions/addRecon';

const CATEGORIES = [
  { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingBag },
  { id: 'saas', label: 'SaaS / App', icon: BlocksIcon },
  { id: 'blog', label: 'Blog / News', icon: Newspaper },
  { id: 'api', label: 'API Endpoint', icon: PlugZap },
  { id: 'custom', label: 'Custom Web', icon: Globe2Icon }
];

export function AddReconModal() {
  const dispatch = useDispatch();
  const { addReconState } = useSelector((state: RootState) => state.addRecon);

  // Form states
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [mission, setMission] = useState('');
  const [type, setType] = useState('custom');
  const [intelligenceEnabled, setIntelligenceEnabled] = useState(true);

  //form state
  const [state, formAction, isPending] = useActionState(addReconAction, null);

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!state) return; // initial state, skip

    if (state.error) {
      toast.error(state.error);
      setIsSubmitting(false);
    } else if (state.sucess) {
      toast.success('Target set up successfully!', {
        description: `Monitoring started for ${url}`,
        icon: <CheckCircle2 className="text-emerald-500 size-5" />
      });

      // re clearing instead of using handleclose cause the function executes before state of isSubmitting becomes false which skips closing the form
      setIsSubmitting(false);
      setUrl('');
      setTitle('');
      setMission('');
      setType('custom');
      setIntelligenceEnabled(true);
      dispatch(setAddReconReducer());
    }
  }, [state]);



  const handleClose = () => {
    if (!isSubmitting) {
      dispatch(setAddReconReducer());
      // Reseting form states on close
      setUrl('');
      setTitle('');
      setMission('');
      setType('custom');
      setIntelligenceEnabled(true);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) {
      toast.error('Please enter a target URL');
      return;
    }
    if (!mission) {
      toast.error('Please enter mission / instruction');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <Dialog open={addReconState} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-border/40 shadow-2xl bg-background/95 backdrop-blur ">


        <form onSubmit={handleSubmit} className="flex flex-col gap-0">

          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4   border-b border-border/40 bg-muted/20">
            <DialogTitle className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
              Deploy Recon Target
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs mt-0.5">
              Set up a website-agnostic AI agent to monitor content, track mutations, and extract intelligence.
            </DialogDescription>
          </DialogHeader>

          {/* Form Body */}
          <div className="px-6 py-5 space-y-7 max-h-[65vh] overflow-y-auto ">

            {/*  URL */}
            <div className="space-y-3">
              <Label htmlFor="url" className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                <Globe className="size-4 text-muted-foreground" />
                Target Web Address
                <span className="text-red-400">
                  *
                </span>
              </Label>
              <div className="relative">
                <Input
                  id="url"
                  name='url'
                  type="text"
                  placeholder="https://example.com/pricing"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-9 h-10 border-border/60 placeholder:text-muted-foreground/60 focus-visible:ring-primary/25 focus-visible:border-primary bg-background/40"
                  required
                  disabled={isSubmitting}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium select-none pointer-events-none">
                  <Globe className="size-4" />
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground/75 flex items-center gap-1">
                <Info className="size-3 text-primary" />
                The URL must be accessible to our AI scraper.
              </p>
            </div>

            {/*  Title */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                <FileText className="size-4 text-muted-foreground" />
                Target Alias / Title
                <span className='text-red-400'>
                  *
                </span>
              </Label>
              <Input
                id="title"
                name='title'
                type="text"
                placeholder="e.g. Acme Pricing Page"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 border-border/60 placeholder:text-muted-foreground/60 focus-visible:ring-primary/25 focus-visible:border-primary bg-background/40"
                disabled={isSubmitting}
              />
            </div>

            {/* Category selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                <Tag className="size-4 text-muted-foreground"
                  name='category' />
                Target Category
              </Label>
              <input type='hidden' name='type' value={type} />
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = type === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setType(cat.id)}
                      disabled={isSubmitting}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all select-none ${isSelected
                        ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/15 scale-[1.02]'
                        : 'border-border/60 hover:border-border bg-background/30 hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      <span>{<cat.icon size={15} />}</span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mission / Extraction Instructions */}
            <div className="space-y-3">
              <Label htmlFor="mission" className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                <Eye className="size-4 text-muted-foreground" />
                Recon Mission & Instructions
                <span className="text-red-400">
                  *
                </span>
              </Label>
              <textarea
                id="mission"
                required
                name='mission'
                rows={3}
                placeholder="What exactly should the AI monitor or extract? (e.g. Extract product price and alert if prices drop or updates.)"
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-50"
                disabled={isSubmitting}
              />
            </div>

            {/* AI Intelligence Toggle Card */}
            <div className="pt-2">
              <div
                onClick={() => !isSubmitting && setIntelligenceEnabled(!intelligenceEnabled)}
                className={`flex gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${intelligenceEnabled
                  ? 'border-primary/40 bg-primary/5 hover:bg-primary/10 shadow-sm shadow-primary/5'
                  : 'border-border/60 hover:border-border bg-background/20 hover:bg-muted/20'
                  }`}
              >
                <input type="hidden" value={intelligenceEnabled ? "true" : "false"} name='intelligenceEnabled' />
                <div className={`p-2 rounded-lg h-fit ${intelligenceEnabled ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Cpu className="size-4" />
                </div>

                <div className="flex items-center justify-between w-full">

                  <span className="text-xs font-semibold tracking-tight text-foreground">
                    AI Intelligence Agent
                  </span>

                  <div className={`w-8 h-4  rounded-full p-0.5 transition-colors duration-200 ${intelligenceEnabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}>

                    <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${intelligenceEnabled ? 'translate-x-4' : 'translate-x-0'}`}
                    />

                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-7 border-t border-border/40 bg-muted/25 flex flex-row items-center justify-end gap-2 ">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-muted-foreground font-bold hover:text-foreground border text-xs border-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="relative shadow-lg shadow-primary/15 min-w-[140px] text-xs font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-2" />
                  Deploying Agent...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5 mr-1.5" />
                  Start Intelligence
                </>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog >
  );
}
