'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, GraduationCap, Baby, User, Briefcase, ShoppingCart, ShieldAlert, Info, Home, HeartPulse } from 'lucide-react';

// Data
const RIGHTS_DATA = [
    // Women
    {
        id: 'w1',
        title: 'Right to Zero FIR',
        description: 'A woman can file an FIR at any police station irrespective of the location of the incident.',
        category: 'Women',
        article: 'Section 154 CrPC'
    },
    {
        id: 'w2',
        title: 'Right to Privacy while Recording Statement',
        description: 'A woman can record her statement with a female constable and in private.',
        category: 'Women',
        article: 'Section 164 CrPC'
    },
    {
        id: 'w3',
        title: 'No Arrest at Night',
        description: 'Women cannot be arrested after sunset and before sunrise, except in exceptional circumstances with a magistrate\'s order.',
        category: 'Women',
        article: 'Section 46(4) CrPC'
    },
    {
        id: 'w4',
        title: 'Right to Equal Pay',
        description: 'Women are entitled to equal pay for equal work as men.',
        category: 'Women',
        article: 'Equal Remuneration Act'
    },
    {
        id: 'w5',
        title: 'Maternity Benefits',
        description: 'Right to paid maternity leave for 26 weeks for the first two children.',
        category: 'Women',
        article: 'Maternity Benefit Act'
    },
    {
        id: 'w6',
        title: 'Protection from Domestic Violence',
        description: 'Right to protection against physical, mental, verbal, or economic abuse at home.',
        category: 'Women',
        article: 'Domestic Violence Act, 2005'
    },

    // Children
    {
        id: 'c1',
        title: 'Right to Free and Compulsory Education',
        description: 'Every child between the ages of 6 and 14 has the right to free and compulsory education.',
        category: 'Children',
        article: 'Article 21A, RTE Act'
    },
    {
        id: 'c2',
        title: 'Protection from Child Labor',
        description: 'Prohibition of employment of children below 14 years in factories, mines, or hazardous employment.',
        category: 'Children',
        article: 'Article 24'
    },
    {
        id: 'c3',
        title: 'Protection from Sexual Offenses (POCSO)',
        description: 'Strict laws to protect children from sexual assault, harassment, and pornography.',
        category: 'Children',
        article: 'POCSO Act, 2012'
    },

    // Students
    {
        id: 's1',
        title: 'Right to Information',
        description: 'Students can request copies of their answer sheets and other institutional information.',
        category: 'Students',
        article: 'RTI Act, 2005'
    },
    {
        id: 's2',
        title: 'Anti-Ragging Rights',
        description: 'Ragging is a criminal offense. Students have the right to a ragging-free campus.',
        category: 'Students',
        article: 'UGC Regulations'
    },

    // Employees
    {
        id: 'e1',
        title: 'Right to Minimum Wages',
        description: 'Every employee has the right to be paid at least the minimum wage fixed by the government.',
        category: 'Employees',
        article: 'Minimum Wages Act'
    },
    {
        id: 'e2',
        title: 'Prevention of Sexual Harassment (POSH)',
        description: 'Right to a safe workplace free from sexual harassment.',
        category: 'Employees',
        article: 'POSH Act, 2013'
    },
    {
        id: 'e3',
        title: 'Right to Gratuity',
        description: 'Employees working for 5+ years are entitled to gratuity upon termination/retirement.',
        category: 'Employees',
        article: 'Payment of Gratuity Act'
    },

    // Consumers
    {
        id: 'co1',
        title: 'Right to Safety',
        description: 'Protection against goods and services that are hazardous to life and property.',
        category: 'Consumers',
        article: 'Consumer Protection Act'
    },
    {
        id: 'co2',
        title: 'Right to Choose',
        description: 'Right to be assured access to a variety of goods and services at competitive prices.',
        category: 'Consumers',
        article: 'Consumer Protection Act'
    },
    {
        id: 'co3',
        title: 'Right to Seek Redressal',
        description: 'Right to seek compensation against unfair trade practices or exploitation.',
        category: 'Consumers',
        article: 'Consumer Protection Act'
    },

    // Arrested Persons
    {
        id: 'a1',
        title: 'Right to Know Grounds of Arrest',
        description: 'Police must inform the arrested person of the grounds of arrest immediately.',
        category: 'Arrested Persons',
        article: 'Article 22(1), Section 50 CrPC'
    },
    {
        id: 'a2',
        title: 'Right to be Produced before Magistrate',
        description: 'An arrested person must be produced before a magistrate within 24 hours.',
        category: 'Arrested Persons',
        article: 'Article 22(2), Section 57 CrPC'
    },
    {
        id: 'a3',
        title: 'Right to Legal Aid',
        description: 'Right to consult a lawyer of choice and free legal aid if indigent.',
        category: 'Arrested Persons',
        article: 'Article 39A'
    },

    // Senior Citizens
    {
        id: 'sc1',
        title: 'Right to Maintenance',
        description: 'Senior citizens can claim maintenance from children/heirs if unable to maintain themselves.',
        category: 'Senior Citizens',
        article: 'Maintenance and Welfare of Parents and Senior Citizens Act'
    },
    {
        id: 'sc2',
        title: 'Tax Benefits',
        description: 'Higher exemption limits and tax benefits for senior citizens.',
        category: 'Senior Citizens',
        article: 'Income Tax Act'
    },

    // Men
    {
        id: 'm1',
        title: 'Protection against False Dowry Cases',
        description: 'Legal remedies available against misuse of Section 498A (Dowry Harassment).',
        category: 'Men',
        article: 'Judicial Precedents'
    },
    {
        id: 'm2',
        title: 'Right to Child Custody',
        description: 'Fathers have equal rights to seek custody of their children.',
        category: 'Men',
        article: 'Guardians and Wards Act'
    },
    
    // Tenants
    {
        id: 't1',
        title: 'Right against Unfair Eviction',
        description: 'Landlords cannot evict tenants without proper notice and valid legal grounds.',
        category: 'Tenants',
        article: 'Rent Control Act'
    },
    {
        id: 't2',
        title: 'Right to Essential Services',
        description: 'Landlord cannot cut off water or electricity supply to force eviction.',
        category: 'Tenants',
        article: 'Rent Control Act'
    }
];

const CATEGORIES = [
    { name: 'All', icon: BookOpen },
    { name: 'Women', icon: User },
    { name: 'Children', icon: Baby },
    { name: 'Students', icon: GraduationCap },
    { name: 'Employees', icon: Briefcase },
    { name: 'Consumers', icon: ShoppingCart },
    { name: 'Arrested Persons', icon: ShieldAlert },
    { name: 'Senior Citizens', icon: HeartPulse },
    { name: 'Men', icon: User },
    { name: 'Tenants', icon: Home },
];

export default function KnowYourRightsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredRights = RIGHTS_DATA.filter(right => {
        const matchesSearch = right.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              right.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || right.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-0 pb-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Know Your Rights</h1>
                    <p className="text-muted-foreground">Empower yourself with knowledge about your legal rights and protections.</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search for rights (e.g., arrest, education, maternity)..." 
                        className="pl-10 h-12 text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <Button
                                key={cat.name}
                                variant={selectedCategory === cat.name ? "default" : "outline"}
                                onClick={() => setSelectedCategory(cat.name)}
                                className="gap-2 rounded-full"
                            >
                                <Icon className="h-4 w-4" />
                                {cat.name}
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Rights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRights.length > 0 ? (
                    filteredRights.map(right => (
                        <Card key={right.id} className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
                            <CardHeader>
                                <div className="flex justify-between items-start gap-2">
                                    <Badge variant="secondary" className="mb-2">{right.category}</Badge>
                                    <Badge variant="outline" className="font-mono text-xs">{right.article}</Badge>
                                </div>
                                <CardTitle className="text-xl">{right.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base text-foreground/80">
                                    {right.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <Info className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No rights found matching your criteria.</p>
                        <Button variant="link" onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}>Clear filters</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
