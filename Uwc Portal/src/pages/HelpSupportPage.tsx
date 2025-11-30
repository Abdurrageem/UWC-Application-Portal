import { motion } from 'framer-motion'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  FileQuestion,
  ExternalLink,
  ChevronRight
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PageContainer } from '@/components'
import { pageTransition, fadeIn } from '@/lib/animations'

const contactDetails = {
  admissions: {
    title: 'Admissions Office',
    phone: '+27 21 959 2911',
    email: 'admissions@uwc.ac.za',
    hours: 'Monday - Friday: 08:00 - 16:30',
  },
  financialAid: {
    title: 'Financial Aid Office',
    phone: '+27 21 959 2853',
    email: 'financialaid@uwc.ac.za',
    hours: 'Monday - Friday: 08:00 - 16:30',
  },
  registrar: {
    title: "Registrar's Office",
    phone: '+27 21 959 2201',
    email: 'registrar@uwc.ac.za',
    hours: 'Monday - Friday: 08:00 - 16:30',
  },
  itSupport: {
    title: 'IT Support (Technical Issues)',
    phone: '+27 21 959 2312',
    email: 'ithelpdesk@uwc.ac.za',
    hours: 'Monday - Friday: 08:00 - 17:00',
  },
}

const physicalAddress = {
  name: 'University of the Western Cape',
  street: 'Robert Sobukwe Road',
  suburb: 'Bellville',
  city: 'Cape Town',
  postalCode: '7535',
  country: 'South Africa',
}

const postalAddress = {
  poBox: 'Private Bag X17',
  city: 'Bellville',
  postalCode: '7535',
  country: 'South Africa',
}

const faqs = [
  {
    question: 'How do I check my application status?',
    answer: 'You can track your application status by logging into the portal and viewing your dashboard. Your application status will be displayed along with any pending actions required from your side.',
  },
  {
    question: 'What documents do I need to upload?',
    answer: 'Required documents include: SA ID document (both sides), National Senior Certificate (Matric Certificate), and any other relevant academic documents. If you have improved matric results, please upload those as well. All documents must be in PDF, JPG, JPEG, or PNG format with a maximum size of 4MB per file.',
  },
  {
    question: 'Can I edit my application after submission?',
    answer: 'Once submitted, you cannot edit your application directly. However, you can contact the Admissions Office if you need to make changes or corrections to your submitted application.',
  },
  {
    question: 'How long does it take to process an application?',
    answer: 'Application processing typically takes 4-6 weeks from the date of submission, provided all required documents have been uploaded. During peak periods, processing may take longer.',
  },
  {
    question: 'What are the minimum requirements for admission?',
    answer: 'Minimum requirements vary by program. Generally, you need a National Senior Certificate (NSC) with Bachelor degree endorsement. Specific program requirements are detailed on the UWC website under each faculty.',
  },
  {
    question: 'How do I apply for financial aid?',
    answer: 'You can indicate your interest in financial aid during the application process. Additionally, you should apply through NSFAS (National Student Financial Aid Scheme) at www.nsfas.org.za. The Financial Aid Office can provide more information about available bursaries and scholarships.',
  },
  {
    question: 'Can I save my application and continue later?',
    answer: 'Yes! Your application is automatically saved as a draft. You can create multiple drafts and continue working on them at any time. Use the "Save & Exit" button to save your progress.',
  },
  {
    question: 'What if I forget my login credentials?',
    answer: 'Use the "Forgot Password" option on the login page to reset your password. If you need further assistance, contact IT Support at ithelpdesk@uwc.ac.za.',
  },
]

export function HelpSupportPage() {
  return (
    <PageContainer
      title="Help & Support"
      description="Get assistance with your application"
    >
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-6"
      >
        {/* Contact Cards */}
        <motion.div variants={fadeIn}>
          <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.values(contactDetails).map((contact) => (
              <Card key={contact.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{contact.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary-600" />
                    <a 
                      href={`tel:${contact.phone.replace(/\s/g, '')}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-primary-600" />
                    <a 
                      href={`mailto:${contact.email}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{contact.hours}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Physical & Postal Address */}
        <motion.div variants={fadeIn}>
          <h2 className="text-lg font-semibold mb-4">Location</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary-600" />
                  Physical Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic text-sm space-y-1">
                  <p className="font-medium">{physicalAddress.name}</p>
                  <p>{physicalAddress.street}</p>
                  <p>{physicalAddress.suburb}</p>
                  <p>{physicalAddress.city}, {physicalAddress.postalCode}</p>
                  <p>{physicalAddress.country}</p>
                </address>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => window.open('https://maps.google.com/?q=University+of+the+Western+Cape', '_blank')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View on Map
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary-600" />
                  Postal Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic text-sm space-y-1">
                  <p>{postalAddress.poBox}</p>
                  <p>{postalAddress.city}</p>
                  <p>{postalAddress.postalCode}</p>
                  <p>{postalAddress.country}</p>
                </address>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <Separator />

        {/* FAQs */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-2 mb-4">
            <FileQuestion className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <Separator />

        {/* Quick Links */}
        <motion.div variants={fadeIn}>
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              onClick={() => window.open('https://www.uwc.ac.za', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-3" />
              <div className="text-left">
                <p className="font-medium">UWC Website</p>
                <p className="text-xs text-muted-foreground">www.uwc.ac.za</p>
              </div>
              <ChevronRight className="h-4 w-4 ml-auto" />
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              onClick={() => window.open('https://www.nsfas.org.za', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-3" />
              <div className="text-left">
                <p className="font-medium">NSFAS</p>
                <p className="text-xs text-muted-foreground">Financial Aid</p>
              </div>
              <ChevronRight className="h-4 w-4 ml-auto" />
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              onClick={() => window.open('mailto:admissions@uwc.ac.za', '_blank')}
            >
              <MessageCircle className="h-4 w-4 mr-3" />
              <div className="text-left">
                <p className="font-medium">Email Support</p>
                <p className="text-xs text-muted-foreground">Get help via email</p>
              </div>
              <ChevronRight className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div variants={fadeIn}>
          <Card className="bg-warning-50 border-warning-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-warning-600 mt-0.5" />
                <div>
                  <p className="font-medium text-warning-900">Emergency Contact</p>
                  <p className="text-sm text-warning-700 mt-1">
                    For urgent matters outside office hours, please contact Campus Security:
                  </p>
                  <p className="text-sm font-medium text-warning-900 mt-2">
                    +27 21 959 2999 (24 hours)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageContainer>
  )
}
