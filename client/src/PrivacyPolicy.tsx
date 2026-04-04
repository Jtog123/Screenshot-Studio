

/*
Privacy Policy
Effective date: 21st of August, 2025

This Privacy Policy describes how getcracked ("we", "our", or "us") collects, uses, and protects your information when you use our interview preparation platform. By using or accessing our Service in any manner, you acknowledge that you accept the practices and policies outlined below, and you hereby consent that we will collect, use and share your information as described in this Privacy Policy.

Remember that your use of getcracked's Service is at all times subject to our Terms of Service. Any terms we use in this Policy without defining them have the definitions given to them in the Terms of Service.

1. Information We Collect
This list details the categories of Personal Data that we collect and have collected over the past 12 months:

Profile or Contact Data
Email address
Username and (optional) account identifiers, such as leaderboard name or user-set name.
Password and authentication information (if signed up using credentials, instead of third-party integration such as Google)
The minimal account setup is simply an email, provided via supported third-party integrations.

Categories of Third Parties With Whom We Share this Personal Data: Service Providers, Parties You Authorize, Access or Authenticate

Payment Data
Payment card type and last 4 digits
Billing address, phone number, and email
Payment processing information (processed by Stripe - we do not store full card details)
Categories of Third Parties With Whom We Share this Personal Data: Service Providers (specifically our payment processing partner, Stripe)

Device/IP Data
IP address
Device ID and type
Operating system and browser information
Domain server information
Categories of Third Parties With Whom We Share this Personal Data: Service Providers, Parties You Authorize, Access or Authenticate

Web Analytics and Usage Data
Page views and user interactions
Time spent on different sections of the Service
Question attempts and progress tracking
Feature usage statistics
Performance metrics for service improvement and user benchmarking
Categories of Third Parties With Whom We Share this Personal Data: Service Providers, Parties You Authorize, Access or Authenticate

Other Identifying Information that You Voluntarily Choose to Provide
Information in emails or messages you send us
Feedback and survey responses
Community forum posts and interactions
Categories of Third Parties With Whom We Share this Personal Data: Service Providers, Business Partners, Parties You Authorize, Access or Authenticate

2. Categories of Sources of Personal Data
We collect Personal Data about you from the following categories of sources:

You
When you provide such information directly to us:
When you create an account or use our interactive tools and Service
When you voluntarily provide information through the Service or surveys (our contribution page).
When you send us an email or otherwise contact us
When you use the Service and such information is collected automatically:
Through Cookies and similar tracking technologies
Device information when you access our Service
Usage data and analytics information
Third Parties
Vendors: We may use analytics providers to analyze how you interact and engage with the Service, or third parties may help us provide you with customer support
Payment Processors: Information from Stripe related to payment processing
3. How We Use Your Information
Provide access to interview questions and premium features
Process payments through Stripe
Track user progress and interactions
Improve our service through analytics
Provide customer support
Legal Basis for Processing
Contract Performance: Processing necessary to provide the Service you purchased
Legitimate Interest: Analytics and service improvement
Consent: Optional features and communications
4. Data Sharing and Third Parties
We work with the following trusted third-party services:

Stripe: For payment processing (PCI DSS compliant)
Discord: For community access and engagement
We do not sell, rent, or share your personal information with other parties except as described in this policy or as required by law.

5. Data Storage and Security
Your data is stored securely using industry-standard encryption. All credentials are salted and hashed, we store nothing sensitive in plaintext.
Payment information is handled exclusively by Stripe, not stored by us
User progress and interactions are stored to enhance your experience
Daily database backups are created and stored elsewhere.
6. Your Rights
You have the following rights regarding your personal data:

Access: Request a copy of your personal data
Rectification: Correct inaccurate or incomplete data
Erasure: Request deletion of your personal data
Portability: Receive your data in a machine-readable format
Objection: Object to processing of your personal data
Restriction: Request limitation of processing
To exercise these rights, contact us at support@getcracked.io.

7. Data Retention
User data and progress: Retained for account management
Payment records: Retained as required by tax and legal obligations
Analytics data: Retained in aggregated, anonymized form
You can request deletion of your data at any time
8. Cookies and Tracking
We use essential cookies for authentication and service functionality
Analytics tools use privacy-focused tracking methods with anonymized data collection and respects user privacy preferences
No third-party advertising cookies are used
You can control cookie preferences in your browser settings
9. Data Breach Notification
In the event of a data breach affecting your personal information, we will notify you within 72 hours when feasible
Notifications will be sent to your registered email address
We will provide details about the breach, affected data, and steps we are taking to address it
10. International Data Transfers
Your data may be processed in countries outside the United States. We ensure appropriate safeguards are in place, including standard contractual clauses and adequate data protection measures where applicable.

11. Changes to This Policy
We may update this Privacy Policy from time to time
Changes will be posted at https://getcracked.io/privacy
Continued use after changes indicates acceptance
13. Contact Information
If you have any questions or comments about this Privacy Policy, the ways in which we collect and use your Personal Data or your choices and rights regarding such collection and use, please do not hesitate to contact us at:

Email: support@getcracked.io
Address: getcracked, 1210 S Indiana Avenue, Chicago, IL 60605

*/

import { Link } from "react-router"
import { div } from "three/src/nodes/TSL.js"
import { useEffect } from "react";

export default function PrivacyPolicy(){

      useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return(

        <div className="flex justify-center  min-h-screen min-w-screen bg-chocolate text-cream-vanilla">

            <div>
            <Link to="/" className="absolute left-60 top-10 text-2xl">✕</Link>
            </div>

            <div className=" mt-20 h-[90%] w-[50%]">
                <h1 className="text-3xl text-cream-vanilla" style={{fontFamily: "Inter, sans-serif"}}> Privacy Policy</h1>
                <h1 className="text-sm text-cream-vanilla/50 mb-10 " style={{fontFamily: "Inter, sans-serif"}}> Effective date: 3rd of April, 2026</h1>
                <div className="mb-10">
                This Privacy Policy describes how ScreenshotSweet ("we", "our", or "us") collects, uses, and protects your information when you use our mockup platform. By using or accessing our Service in any manner, you acknowledge that you accept the practices and policies outlined below, and you hereby consent that we will collect, use and share your information as described in this Privacy Policy.

                Remember that your use of ScreenshotSweet's Service is at all times subject to our Terms of Service. Any terms we use in this Policy without defining them have the definitions given to them in the Terms of Service.
                </div>


                <h1 className="text-3xl text-cream-vanilla mb-3">
                    1. Information We Collect
                </h1>

                <h1 className="mb-3">This list details the categories of Personal Data that we collect.</h1>

                <h1 className="mb-3 text-xl">Profile or Contact Data</h1>


                <ul className="list-disc mb-10">
                    <li className="ml-10">
                        Email address
                    </li>
                    <li className="ml-10">
                        Authentication information associated with Google.
                    </li>
                    <li className="ml-10">
                        Premium access is granted immediatley upon successful payment.
                    </li>
                    <li className="ml-10">
                        The Service uses third-party services including Stripe for payments.
                    </li>
                    <li className="ml-10 font-bold">
                        All sales are final.
                    </li>

                </ul>

                <h1 className="mb-3 text-xl">Payment Data </h1>


                <ul className="list-disc mb-10">
                    <li className="ml-10">
                        Payment processing information (processed by Stripe - we do not store full card details)
                    </li>

                </ul>

                <h1 className="mb-3 text-xl">Web Analytics and Usage Data</h1>

                <ul className="list-disc mb-10">
                    <li className="ml-10">
                        Page views and user interactions.
                    </li>
                    <li className="ml-10">
                        Time spent on different sections of the Service.
                    </li>

                    <li className="ml-10">
                        Feature usage statistics.
                    </li>
                    <li className="ml-10">
                        Performance metrics for service improvement and user benchmarking.
                    </li>

                </ul>

                <h1 className="mb-3 text-xl">Other Identifying Information that You Voluntarily Choose to Provide</h1>

                <ul className="list-disc mb-10">
                    <li className="ml-10">
                        Information in emails or messages you send us.
                    </li>

                </ul>


                <h1 className="text-3xl text-cream-vanilla mb-3">
                    2. Categories of Sources of Personal Data
                </h1>
                <h1 className=" text-cream-vanilla mb-3">
                    We collect Personal Data about you from the following categories of sources:
                </h1>

                <ul className="list-disc ml-5 mb-4">
                    <li>When you provide such information directly to us:</li>
                    <li className="ml-10 text-cream-vanilla/50"> When you create an account through Google.</li>
                    <li className="ml-10 text-cream-vanilla/50"> When you voluntarily provide information through the Service or surveys (our contribution page).</li>
                    <li className="ml-10 text-cream-vanilla/50"> When you send us an email or otherwise contact us.</li>
                </ul>

                <ul className="list-disc mb-10 ml-5">
                    <li>When you use the Service and such information is collected automatically:</li>
                    <li className="ml-10 text-cream-vanilla/50"> Through Cookies and similar tracking technologies</li>
                    <li className="ml-10 text-cream-vanilla/50"> Device information when you access our Service</li>
                    <li className="ml-10 text-cream-vanilla/50"> Usage data and analytics information</li>
                </ul>

                <h1 className=" text-cream-vanilla mb-3 text-xl">
                    Third Parties</h1>
                <ul className="list-disc mb-10 ml-5">
                    <li>Vendors: We may use analytics providers to analyze how you interact and engage with the Service, or third parties may help us provide you with customer support</li>
                    <li className="ml-10 text-cream-vanilla/50"> Payment Processors: Information from Stripe related to payment processing</li>

                </ul>

                <h1 className="text-3xl text-cream-vanilla mb-3">
                    3. How We Use Your Information
                </h1>


                <ul className="list-disc ml-5 mb-4">
                    <li>Provide access to premium mockup features</li>
                    <li className="ml-10 text-cream-vanilla/50"> Process payments through Stripe</li>
                    <li className="ml-10 text-cream-vanilla/50"> Track user progress and interactions</li>
                    <li className="ml-10 text-cream-vanilla/50"> Improve our service through analytics</li>
                    <li className="ml-10 text-cream-vanilla/50"> Provide customer support</li>
                </ul>

                <ul className="list-disc mb-10 ml-5">
                    <li>When you use the Service and such information is collected automatically:</li>
                    <li className="ml-10 text-cream-vanilla/50"> Through Cookies and similar tracking technologies</li>
                    <li className="ml-10 text-cream-vanilla/50"> Device information when you access our Service</li>
                    <li className="ml-10 text-cream-vanilla/50"> Usage data and analytics information.</li>
                </ul>

                <h1 className=" text-cream-vanilla mb-3 text-xl">
                    Third Parties</h1>
                <ul className="list-disc mb-10 ml-5">
                    <li>Vendors: We may use analytics providers to analyze how you interact and engage with the Service, or third parties may help us provide you with customer support</li>
                    <li className=" text-cream-vanilla"> Payment Processors: Information from Stripe related to payment processing</li>

                </ul>

                <h1 className="text-3xl text-cream-vanilla mb-3">
                   Legal Basis for Processing
                </h1>
                 <ul className="list-disc mb-10 ml-5">
                    <li>Contract Performance: Processing necessary to provide the Service you purchased</li>
                    <li className=" text-cream-vanilla"> Legitimate Interest: Analytics and service improvement</li>
                    <li className=" text-cream-vanilla"> Consent: Optional features and communications</li>

                 </ul>





                <h1 className="text-3xl text-cream-vanilla mb-3">
                    4. Data Sharing and Third Parties
                </h1>
                <h1 className="mb-3">We work with the following trusted third-party services:</h1>
                <ul className="list-disc mb-10">
                    <li className="ml-10">
                        Stripe: Stripe: For payment processing (PCI DSS compliant)
                    </li>
                    <li className="ml-10">
                        Google: For Authentication
                    </li>

                </ul>

                <h1 className="mb-10">We do not sell, rent, or share your personal information with other parties except as described in this policy or as required by law.</h1>


                <h1 className="text-3xl text-cream-vanilla mb-3">
                    5. Data Storage and Security
                </h1>
                <ul className="list-disc mb-10">
                    <li className="ml-10">
                        Your data is stored securely using industry-standard encryption. All credentials are salted and hashed, we store nothing sensitive in plaintext.
                    </li>
                    <li className="ml-10">
                        Payment information is handled exclusively by Stripe, not stored by us
                    </li>
                    <li className="ml-10">
                        Payment information is handled exclusively by Stripe, not stored by us
                    </li>
                    <li className="ml-10">
                        User interactions are stored to enhance your experience
                    </li>
                    <li className="ml-10">
                        Daily database backups are created and stored elsewhere.
                    </li>

                </ul>

                <h1 className="text-3xl text-cream-vanilla mb-3">
                    6. Your Rights
                </h1>
                <h1>You have the following rights regarding your personal data:</h1>
                <ul className="list-disc mb-10">
                    <li className="ml-10">
                        Access: Request a copy of your personal data
                    </li>
                    <li className="ml-10">
                        Rectification: Correct inaccurate or incomplete data
                    </li>
                    <li className="ml-10">
                        Erasure: Request deletion of your personal data
                    </li>
                    <li className="ml-10">
                        Portability: Receive your data in a machine-readable format
                    </li>
                    <li className="ml-10">
                        Objection: Object to processing of your personal data
                    </li>
                    <li className="ml-10">
                        Restriction: Request limitation of processing
                    </li>

                </ul>
                <h1 className="mb-10">To exercise these rights, contact us at support@ScreenshotSweet.io.</h1>


                <h1 className="text-3xl text-cream-vanilla mb-3">
                    7. Data Retention
                </h1>
                <ul className="list-disc mb-10">
                    <li className="ml-10">
                        User data and progress: Retained for account management
                    </li>
                    <li className="ml-10">
                        Payment records: Retained as required by tax and legal obligations
                    </li>
                    <li className="ml-10">
                        Analytics data: Retained in aggregated, anonymized form
                    </li>
                    <li className="ml-10">
                        You can request deletion of your data at any time
                    </li>

                </ul>

                <h1 className="text-3xl text-cream-vanilla mb-3">
                    8. Data Breach Notification
                </h1>
                <ul className="list-disc mb-10">
                    <li className="ml-10">
                        In the event of a data breach affecting your personal information, we will notify you within 72 hours when feasible
                    </li>
                    <li className="ml-10">
                        Notifications will be sent to your registered email address
                    </li>
                    <li className="ml-10">
                        We will provide details about the breach, affected data, and steps we are taking to address it
                    </li>

                </ul>

                <h1 className="text-3xl text-cream-vanilla mb-3">
                    9. International Data Transfers
                </h1>
                <h1 className="mb-10">
                    Your data may be processed in countries outside the United States. We ensure appropriate safeguards are in place, including standard contractual clauses and adequate data protection measures where applicable.
                </h1>

                <h1 className="text-3xl text-cream-vanilla mb-3">
                    10. Changes to This Policy
                </h1>
                <ul className="list-disc mb-10">
                    <li className="ml-10">
                        We may update this Privacy Policy periodically
                    </li>
                    <li className="ml-10">
                        Changes will be posted at https://screenshotsweet.io/privacy
                    </li>
                    <li className="ml-10">
                        Continued use after changes indicates acceptance
                    </li>

                </ul>

                <h1 className="text-3xl text-cream-vanilla mb-3">
                    11. Contact Information
                </h1>
                <h1>
                    If you have any questions or comments about this Privacy Policy, the ways in which we collect and use your Personal Data or your choices and rights regarding such collection and use, please do not hesitate to contact us at:
                    Email: support@screenshotsweet.io
                </h1>





                


            </div>
        </div>
    )
}