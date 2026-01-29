'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import SignaturePad from 'react-signature-canvas';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CircleDashed, Download, Eraser, FileText } from 'lucide-react';

const rtiSchema = z.object({
    department: z.string().min(2, "Department/Public Authority name is required"),
    applicantName: z.string().min(2, "Applicant Name is required"),
    fatherSpouseName: z.string().min(2, "Father/Spouse Name is required"),
    permanentAddress: z.string().min(5, "Permanent Address is required"),
    correspondenceAddress: z.string().min(5, "Correspondence Address is required"),
    subjectMatter: z.string().min(5, "Subject Matter is required"),
    period: z.string().min(2, "Period is required"),
    details: z.string().min(10, "Specific Details are required"),
    deliveryMode: z.enum(["Post", "In Person"], { required_error: "Select delivery mode" }),
    postType: z.string().optional(),
    voluntaryDisclosure: z.string().optional(),
    agreePayFee: z.enum(["Yes", "No"], { required_error: "Please confirm fee payment" }),
    feeDepositDetails: z.string().optional(),
    isBPL: z.enum(["Yes", "No"], { required_error: "Select BPL status" }),
    bplCardDetails: z.string().optional(),
});

type RtiFormValues = z.infer<typeof rtiSchema>;

export default function RtiPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const sigPadRef = useRef<SignaturePad>(null);
    const [pdfData, setPdfData] = useState<RtiFormValues | null>(null);
    const pdfTemplateRef = useRef<HTMLDivElement>(null);

    const form = useForm<RtiFormValues>({
        resolver: zodResolver(rtiSchema),
        defaultValues: {
            department: '',
            applicantName: '',
            fatherSpouseName: '',
            permanentAddress: '',
            correspondenceAddress: '',
            subjectMatter: '',
            period: '',
            details: '',
            deliveryMode: 'Post',
            agreePayFee: 'Yes',
            isBPL: 'No',
        }
    });

    const clearSignature = () => {
        sigPadRef.current?.clear();
    };

    const generatePdf = async (values: RtiFormValues) => {
        setIsGenerating(true);
        setPdfData(values);

        // Allow time for the PDF data to render in the hidden template
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!pdfTemplateRef.current) return;

        try {
            const canvas = await html2canvas(pdfTemplateRef.current, { 
                scale: 2,
                useCORS: true,
                windowWidth: 850 // Ensure consistent rendering width
            });
            const imgData = canvas.toDataURL('image/jpeg', 0.8);

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`RTI-Application-${values.applicantName.replace(/\s+/g, '-')}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
        }

        setPdfData(null);
        setIsGenerating(false);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto px-4 md:px-0 pb-12">
            <Card className="border-t-4 border-t-primary">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl">RTI Application Generator</CardTitle>
                    </div>
                    <CardDescription>
                        Easily generate a formal Right to Information (Form A) application. Fill in the details below and download the ready-to-submit PDF.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(generatePdf)} className="space-y-8">
                    
                    {/* 1. Public Authority & Applicant Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">1. Public Authority & Applicant Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="department" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Name of Department / Public Authority</FormLabel><FormControl><Input placeholder="e.g. Ministry of Home Affairs, Municipal Corporation..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="applicantName" render={({ field }) => (<FormItem><FormLabel>Full Name of Applicant</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="fatherSpouseName" render={({ field }) => (<FormItem><FormLabel>Father's / Spouse's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="permanentAddress" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Permanent Address</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="correspondenceAddress" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Correspondence Address</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </CardContent>
                    </Card>

                    {/* 2. Information Solicited */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">2. Particulars of Information Solicited</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField control={form.control} name="subjectMatter" render={({ field }) => (<FormItem><FormLabel>a) Subject Matter of Information (*)</FormLabel><FormControl><Input placeholder="Broad category e.g. Grant of License, Service Matters" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="period" render={({ field }) => (<FormItem><FormLabel>b) Period to which information relates (**)</FormLabel><FormControl><Input placeholder="e.g. Jan 2023 to Dec 2023" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="details" render={({ field }) => (<FormItem><FormLabel>c) Specific Details of Information Required (***)</FormLabel><FormControl><Textarea rows={6} placeholder="Describe the specific documents or information you need..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="deliveryMode" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>d) Mode of Delivery</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select Mode" /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="Post">By Post</SelectItem><SelectItem value="In Person">In Person</SelectItem></SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="postType" render={({ field }) => (<FormItem><FormLabel>e) Post Type (if applicable)</FormLabel><FormControl><Input placeholder="Ordinary / Registered / Speed Post" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                            
                            <FormField control={form.control} name="voluntaryDisclosure" render={({ field }) => (<FormItem><FormLabel>Is this information not made available under voluntary disclosure?</FormLabel><FormControl><Input placeholder="Yes / No / Unknown" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </CardContent>
                    </Card>

                    {/* 3. Fees & Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">3. Fees & Poverty Line Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="isBPL" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Do you belong to Below Poverty Line (BPL)?</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="bplCardDetails" render={({ field }) => (<FormItem><FormLabel>If Yes, BPL Card No. / Proof Details</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="agreePayFee" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Do you agree to pay the required fee?</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="feeDepositDetails" render={({ field }) => (<FormItem><FormLabel>Details of Fee Deposit (if already paid)</FormLabel><FormControl><Input placeholder="Receipt No. / IPO No. / Date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Signature */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Signature</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="signature-pad">Applicant's Signature:</Label>
                            <div className="mt-2 border rounded-md bg-background w-full max-w-md">
                                <SignaturePad
                                    ref={sigPadRef}
                                    canvasProps={{ id: 'signature-pad', className: 'w-full h-[150px]' }}
                                />
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={clearSignature} className="mt-2">
                                <Eraser className="w-4 h-4 mr-2" />
                                Clear Signature
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" size="lg" disabled={isGenerating} className="w-full md:w-auto">
                            {isGenerating ? <CircleDashed className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
                            {isGenerating ? 'Generating PDF...' : 'Generate RTI Application PDF'}
                        </Button>
                    </div>
                </form>
            </Form>

            {/* Hidden PDF Template */}
            <div className="absolute -left-[99px] top-0 opacity-0 w-[210mm]">
                {pdfData && (
                    <div ref={pdfTemplateRef} className="px-[20mm] pt-[20mm] pb-[40mm] bg-white text-black font-serif text-[11pt] leading-relaxed">
                        <style>{`
                            .rti-header { text-align: center; margin-bottom: 20px; }
                            .rti-title { font-weight: bold; text-decoration: underline; font-size: 14pt; margin-bottom: 5px; }
                            .rti-subtitle { font-weight: bold; font-size: 12pt; }
                            .rti-id { text-align: right; margin-bottom: 20px; font-size: 10pt; }
                            .rti-to { margin-bottom: 20px; font-weight: bold; line-height: 1.5; }
                            .rti-row { display: flex; margin-bottom: 12px; align-items: flex-start; }
                            .rti-num { width: 30px; font-weight: bold; flex-shrink: 0; }
                            .rti-label { width: 250px; font-weight: bold; flex-shrink: 0; }
                            .rti-value { flex-grow: 1; border-bottom: 1px dotted #000; padding-left: 5px; min-height: 20px; }
                            .rti-sub-row { display: flex; margin-left: 30px; margin-bottom: 8px; }
                            .rti-sub-label { width: 220px; }
                            .rti-multiline { white-space: pre-wrap; word-wrap: break-word; }
                            .rti-footer { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                            .rti-signature-img { max-height: 50px; max-width: 150px; }
                            .rti-notes { margin-top: 30px; font-size: 9pt; border-top: 1px solid #000; padding-top: 10px; }
                            .rti-ack { margin-top: 40px; border-top: 2px dashed #000; padding-top: 20px; }
                        `}</style>

                        <div className="rti-header">
                            <div className="rti-title">RTI APPLICATION FORM 'A'</div>
                            <div className="rti-subtitle">See Rule 3(1)</div>
                        </div>

                        <div className="rti-id">
                            I. D. No.......................<br/>
                            (For Office Use Only)
                        </div>

                        <div className="rti-to">
                            To,<br/>
                            The Public Information Officer /<br/>
                            Assistant Public Information Officer,<br/>
                            <span style={{fontWeight: 'normal'}}>{pdfData.department}</span>
                        </div>

                        <div className="rti-row">
                            <div className="rti-num">1.</div>
                            <div className="rti-label">Full Name of The Applicant :</div>
                            <div className="rti-value">{pdfData.applicantName}</div>
                        </div>

                        <div className="rti-row">
                            <div className="rti-num">2.</div>
                            <div className="rti-label">Father Name/Spouse Name :</div>
                            <div className="rti-value">{pdfData.fatherSpouseName}</div>
                        </div>

                        <div className="rti-row">
                            <div className="rti-num">3.</div>
                            <div className="rti-label">Permanent Address :</div>
                            <div className="rti-value rti-multiline">{pdfData.permanentAddress}</div>
                        </div>

                        <div className="rti-row">
                            <div className="rti-num">4.</div>
                            <div className="rti-label">Correspondence Address :</div>
                            <div className="rti-value rti-multiline">{pdfData.correspondenceAddress}</div>
                        </div>

                        <div className="rti-row">
                            <div className="rti-num">5.</div>
                            <div className="rti-label">Particulars of Information Solicited :</div>
                        </div>

                        <div className="rti-sub-row">
                            <div className="rti-num">a)</div>
                            <div className="rti-sub-label">Subject Matter of Information (*):</div>
                            <div className="rti-value">{pdfData.subjectMatter}</div>
                        </div>
                        <div className="rti-sub-row">
                            <div className="rti-num">b)</div>
                            <div className="rti-sub-label">The period to which information relates (**):</div>
                            <div className="rti-value">{pdfData.period}</div>
                        </div>
                        <div className="rti-sub-row">
                            <div className="rti-num">c)</div>
                            <div className="rti-sub-label">Specific Details of Information required (***):</div>
                        </div>
                        <div style={{ marginLeft: '60px', marginBottom: '15px', border: '1px solid #ccc', padding: '10px', minHeight: '80px' }} className="rti-multiline">
                            {pdfData.details}
                        </div>

                        <div className="rti-sub-row">
                            <div className="rti-num">d)</div>
                            <div className="rti-sub-label">Whether information is required by Post or in person:</div>
                            <div className="rti-value">{pdfData.deliveryMode}</div>
                        </div>
                        <div className="rti-sub-row">
                            <div className="rti-num">e)</div>
                            <div className="rti-sub-label">In case by Post (Ordinary/Registered/Speed):</div>
                            <div className="rti-value">{pdfData.postType || 'N/A'}</div>
                        </div>

                        <div className="rti-row">
                            <div className="rti-num">6.</div>
                            <div className="rti-label">Is this information not made available by public authority under voluntary disclosure? :</div>
                            <div className="rti-value">{pdfData.voluntaryDisclosure || 'N/A'}</div>
                        </div>

                        <div className="rti-row">
                            <div className="rti-num">7.</div>
                            <div className="rti-label">Do you agree to pay the required fee? :</div>
                            <div className="rti-value">{pdfData.agreePayFee}</div>
                        </div>

                        <div className="rti-row">
                            <div className="rti-num">8.</div>
                            <div className="rti-label">Have you deposited application fee? :</div>
                            <div className="rti-value">{pdfData.feeDepositDetails ? `Yes (${pdfData.feeDepositDetails})` : 'No'}</div>
                        </div>

                        <div className="rti-row">
                            <div className="rti-num">9.</div>
                            <div className="rti-label">Whether belongs to Below Poverty Line category? :</div>
                            <div className="rti-value">{pdfData.isBPL} {pdfData.isBPL === 'Yes' && pdfData.bplCardDetails ? `(Card: ${pdfData.bplCardDetails})` : ''}</div>
                        </div>

                        <div className="rti-footer">
                            <div>
                                Place: _________________<br/><br/>
                                Date: {new Date().toLocaleDateString()}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                {sigPadRef.current && !sigPadRef.current.isEmpty() && (
                                    <img src={sigPadRef.current.toDataURL()} alt="Signature" className="rti-signature-img" />
                                )}
                                <br/>
                                ____________________________<br/>
                                <strong>Signature of Applicant</strong>
                            </div>
                        </div>

                        <div className="rti-notes">
                            (*) Broad Category of the subject to be indicated (such as grant of government service matters/Licenses etc.)<br/>
                            (**) Relevant period for which information is required to be indicated.<br/>
                            (***) Specific details of the information are required to be indicated.
                        </div>

                        {/* Form B - Acknowledgement */}
                        <div className="rti-ack">
                            <div className="rti-header">
                                <div className="rti-title">FORM "B"</div>
                                <div className="rti-subtitle">[See rule 3(2)] Acknowledgement</div>
                            </div>
                            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                                <strong>Office of the State Public Information Officer</strong>
                            </div>
                            <div className="rti-row">
                                <div style={{ width: '100%' }}>
                                    Received the application form from Mr/Ms <u>{pdfData.applicantName}</u><br/>
                                    Address <u>{pdfData.correspondenceAddress}</u><br/>
                                    Seeking information on <u>{pdfData.subjectMatter}</u><br/>
                                    Vide Diary No.: ____________________________ Dated: _________________________
                                </div>
                            </div>
                            <div className="rti-footer" style={{ marginTop: '20px' }}>
                                <div>Place: ___________<br/>Date: ___________</div>
                                <div style={{ textAlign: 'center' }}>
                                    ____________________________<br/>
                                    <strong>Full Name & Designation of PIO</strong><br/>
                                    (Seal)
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}