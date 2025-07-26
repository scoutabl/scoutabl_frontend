import React, { useState } from 'react'
import { useAssessmentContext } from '@/components/common/AssessmentNavbarWrapper';
import AssessmentStep from '@/components/common/AssessmentStep';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Toggle } from '@/components/ui/toggle';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import AiIcon from '@/assets/AiIcon.svg?react';
import ChevronLeftIcon from '@/assets/chevronLeftIcon.svg?react';
import ChevronDownIcon from '@/assets/chevronDownIcon.svg?react';
import PlusIcon from '@/assets/plusIcon.svg?react';
import TrashIcon from '@/assets/trashIcon.svg?react';
import CloudIcon from '@/assets/cloudIcon.svg?react';
import { X, Crown, HelpCircle } from 'lucide-react';

const Step4 = () => {
    const { steps, selectedStep, handleStepChange } = useAssessmentContext();
    const [activeTab, setActiveTab] = useState('essential-settings');
    const [domains, setDomains] = useState(['gmail.com', 'abc.com']);
    const [selectedUsers, setSelectedUsers] = useState(['sxcscascsc', 'scacascasc']);
    
    // Section collapse state
    const [collapsedSections, setCollapsedSections] = useState({
        'sequence': false,
        'essential-settings': false,
        'assessment-validity': false,
        'team-access': false,
        'proctoring': false,
        'legal': false
    });

    const tabs = [
        { id: 'sequence', label: 'Sequence' },
        { id: 'essential-settings', label: 'Essential Settings' },
        { id: 'assessment-validity', label: 'Assessment Validity' },
        { id: 'team-access', label: 'Team Access' },
        { id: 'proctoring', label: 'Proctoring' },
        { id: 'legal', label: 'Legal' }
    ];

    const removeDomain = (domain) => {
        setDomains(domains.filter(d => d !== domain));
    };

    const removeUser = (user) => {
        setSelectedUsers(selectedUsers.filter(u => u !== user));
    };

    const scrollToSection = (sectionId) => {
        setActiveTab(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const toggleSectionCollapse = (sectionId) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Progress Section */}
            <div className="flex flex-row justify-between items-end">
                <AssessmentStep
                    steps={steps}
                    selected={selectedStep}
                    onSelect={handleStepChange}
                />
                
                {/* Pro Tip */}
                {/* <div className="min-w-[450px] bg-purple-50 rounded-5xl px-4 py-6 flex items-center gap-3 border">
                    <AiIcon className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-500 inline-block text-transparent bg-clip-text font-semibold">Pro Tip: </span>
                        Scoutabl's AI suggests tests by matching skills in your job description with related tests.
                    </p>
                </div> */}
            </div>

            {/* Tab Navigation - Centered */}
            <div className="flex justify-center">
                <div className="bg-white rounded-full p-2 border">
                    <div className="flex gap-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => scrollToSection(tab.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-purplePrimary text-white'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area - All Sections Visible */}
            <div className="space-y-6">
                {/* Sequence Section */}
                <Section
                    id="sequence"
                    header="Sequence"
                    collapsable={true}
                    collapsed={collapsedSections['sequence']}
                    onToggle={() => toggleSectionCollapse('sequence')}
                >
                    <div className="text-center py-12">
                        <div className="mb-4">
                            {/* Add sequence icon */}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">You haven't added anything yet!</h3>
                        <p className="text-gray-500 mb-6">Stay productive by creating a task.</p>
                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" className="rounded-xl">
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add Question
                            </Button>
                            <Button className="rounded-xl bg-purplePrimary hover:bg-purplePrimary/80">
                                Add from Library
                            </Button>
                        </div>
                    </div>
                </Section>

                {/* Essential Settings Section */}
                <Section
                    id="essential-settings"
                    header="Essential Settings"
                    collapsable={true}
                    collapsed={collapsedSections['essential-settings']}
                    onToggle={() => toggleSectionCollapse('essential-settings')}
                >
                    <div className="space-y-6">
                        {/* Assessment Description */}
                        <div className="bg-gray-50 rounded-2xl p-6 border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">📄</span>
                                    </div>
                                    <h3 className="text-lg font-semibold">Assessment Description</h3>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700">Software Developer</span>
                                    <div className="flex items-center gap-2 text-purplePrimary text-sm">
                                        <AiIcon className="w-4 h-4" />
                                        Write with AI
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Show Results to Candidates */}
                        <div className="bg-gray-50 rounded-2xl p-6 border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Toggle />
                                    <h3 className="text-lg font-semibold">Show results to candidates</h3>
                                </div>
                                <Button className="bg-gradient-to-r from-purplePrimary to-pink-500 text-white rounded-full px-4 py-2 text-sm">
                                    <Crown className="w-4 h-4 mr-1" />
                                    Upgrade
                                </Button>
                            </div>
                        </div>

                        {/* Add Intro Video */}
                        <div className="bg-gray-50 rounded-2xl p-6 border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">🎥</span>
                                    </div>
                                    <h3 className="text-lg font-semibold">Add Intro Video</h3>
                                </div>
                                <Button className="bg-gradient-to-r from-purplePrimary to-pink-500 text-white rounded-full px-4 py-2 text-sm">
                                    <Crown className="w-4 h-4 mr-1" />
                                    Upgrade
                                </Button>
                            </div>
                            <div className="space-y-4">
                                <Input placeholder="Paste a link to your video" className="w-full" />
                                <div className="text-center text-gray-500">or</div>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                                    <CloudIcon className="w-8 h-8 mx-auto mb-4 text-blue-500" />
                                    <h4 className="font-medium mb-2">Upload video file</h4>
                                    <p className="text-gray-500 text-sm mb-4">Drag & Drop file here</p>
                                    <p className="text-gray-400 text-xs">Max: 10 Mb</p>
                                </div>
                                <div className="bg-white rounded-lg border p-3 flex items-center gap-3">
                                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">📄</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-medium">XYZ.mp4</span>
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                            <span className="text-blue-600">Preview</span>
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                            <span className="text-gray-500">5.7MB</span>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Collect Candidate Documents */}
                        <div className="bg-gray-50 rounded-2xl p-6 border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Toggle />
                                    <h3 className="text-lg font-semibold">Collect Candidate Documents</h3>
                                </div>
                                <Button className="bg-gradient-to-r from-purplePrimary to-pink-500 text-white rounded-full px-4 py-2 text-sm">
                                    <Crown className="w-4 h-4 mr-1" />
                                    Join Pro
                                </Button>
                            </div>
                            <div className="bg-purpleQuaternary rounded-2xl p-4 mb-4">
                                <h4 className="font-semibold text-purplePrimary mb-2">Learn About Document Vault</h4>
                                <p className="text-sm text-gray-700">
                                    Qualifying questions are presented to candidates ahead of the tests. The answers to these questions determine if candidates satisfy the essential requirements of the job. Only if all questions are answered as required, they proceed to the tests. You can add up to 5 questions.
                                </p>
                            </div>
                            <div className="space-y-3">
                                {['Resume', 'Cover Letter', 'Relieving Letter', 'Experience Certificate/ Letter'].map((doc) => (
                                    <div key={doc} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                        <Checkbox />
                                        <span className="text-sm">{doc}</span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-3 p-3 bg-purplePrimary rounded-lg">
                                    <PlusIcon className="w-4 h-4 text-white" />
                                    <span className="text-sm text-white">Custom (PDF)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Assessment Validity Section */}
                <Section
                    id="assessment-validity"
                    header={
                        <div className="flex items-center justify-between w-full">
                            <h2 className="text-xl font-semibold">Assessment Validity</h2>
                            <Button className="bg-gradient-to-r from-purplePrimary to-pink-500 text-white rounded-full px-4 py-2 text-sm">
                                <Crown className="w-4 h-4 mr-1" />
                                Upgrade
                            </Button>
                        </div>
                    }
                    collapsable={true}
                    collapsed={collapsedSections['assessment-validity']}
                    onToggle={() => toggleSectionCollapse('assessment-validity')}
                >
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-2xl p-6 border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Toggle />
                                    <h3 className="text-lg font-semibold">Assessment Start and End Date</h3>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Set an exact date and time for the assessment to expire. This option is recommended if inviting candidates using link share & integration. Candidates who are in progress when the assessment expires can finish.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                    <span className="text-gray-700">Start Date & Time: DD/MM/YYYY HH:MM</span>
                                    <ChevronDownIcon className="w-4 h-4 ml-auto" />
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                    <span className="text-gray-700">End Date & Time: DD/MM/YYYY HH:MM</span>
                                    <ChevronDownIcon className="w-4 h-4 ml-auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Team Access Section */}
                <Section
                    id="team-access"
                    header={
                        <div className="flex items-center justify-between w-full">
                            <h2 className="text-xl font-semibold">Access</h2>
                            <Button className="bg-gradient-to-r from-purplePrimary to-pink-500 text-white rounded-full px-4 py-2 text-sm">
                                <Crown className="w-4 h-4 mr-1" />
                                Join Pro
                            </Button>
                        </div>
                    }
                    collapsable={true}
                    collapsed={collapsedSections['team-access']}
                    onToggle={() => toggleSectionCollapse('team-access')}
                >
                    <div className="space-y-6">
                        {/* Assessment Access */}
                        <div className="bg-gray-50 rounded-2xl p-6 border">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-semibold">Assessment Access</h3>
                                <HelpCircle className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                    <span className="text-gray-500">Selected Users</span>
                                    <ChevronDownIcon className="w-4 h-4 ml-auto" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                        <span className="text-gray-500">Choose Users</span>
                                        <ChevronDownIcon className="w-4 h-4 ml-auto" />
                                    </div>
                                    <div className="flex gap-2">
                                        {selectedUsers.map((user) => (
                                            <Badge key={user} variant="secondary" className="bg-blue-100 text-blue-800">
                                                {user}
                                                <button onClick={() => removeUser(user)} className="ml-2">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Domain Restriction */}
                        <div className="bg-gray-50 rounded-2xl p-6 border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Toggle />
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold">Domain Restriction</h3>
                                        <HelpCircle className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                    <span className="text-gray-500">Allowed</span>
                                    <ChevronDownIcon className="w-4 h-4 ml-auto" />
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                    <span className="text-gray-500">Selected Users</span>
                                </div>
                                <div className="flex gap-2">
                                    {domains.map((domain) => (
                                        <Badge key={domain} variant="secondary" className="bg-blue-100 text-blue-800">
                                            {domain}
                                            <button onClick={() => removeDomain(domain)} className="ml-2">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Proctoring Section */}
                <Section
                    id="proctoring"
                    header="Proctoring"
                    collapsable={true}
                    collapsed={collapsedSections['proctoring']}
                    onToggle={() => toggleSectionCollapse('proctoring')}
                >
                    <div className="space-y-6">
                        {/* Basic Proctoring */}
                        <div className="bg-gray-50 rounded-2xl p-6 border">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Basic Proctoring</h3>
                                <p className="text-sm text-gray-600">
                                    Auto grade your assessments wit AI Auto grade your assessments wit AIAuto grade your assessments wit AIAuto grade your assessments wit AI
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    {[
                                        { label: 'Location logging', enabled: false },
                                        { label: 'Webcam snapshots', enabled: false },
                                        { label: 'Plagiarism detection', enabled: false },
                                        { label: 'Browser extension detection', enabled: false },
                                        { label: 'Fullscreen mode detection', enabled: false },
                                        { label: 'Mouse out tracking', enabled: false }
                                    ].map((item) => (
                                        <div key={item.label} className="bg-white rounded-xl p-4 border">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Toggle enabled={item.enabled} />
                                                    <span className="font-medium">{item.label}</span>
                                                    <HelpCircle className="w-4 h-4 text-gray-400" />
                                                </div>
                                                {!item.enabled && (
                                                    <Button size="sm" className="bg-gradient-to-r from-purplePrimary to-pink-500 text-white rounded-full px-3 py-1">
                                                        <Crown className="w-3 h-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    {[
                                        { label: 'Disable copy & Paste', enabled: true },
                                        { label: 'IP logging', enabled: false },
                                        { label: 'Tab proctoring', enabled: false },
                                        { label: 'Keystroke analysis', enabled: false },
                                        { label: 'Screen record protection', enabled: false },
                                        { label: 'Restrict multiple monitors', enabled: false }
                                    ].map((item) => (
                                        <div key={item.label} className="bg-white rounded-xl p-4 border">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Toggle enabled={item.enabled} />
                                                    <span className="font-medium">{item.label}</span>
                                                    <HelpCircle className="w-4 h-4 text-gray-400" />
                                                </div>
                                                {!item.enabled && (
                                                    <Button size="sm" className="bg-gradient-to-r from-purplePrimary to-pink-500 text-white rounded-full px-3 py-1">
                                                        <Crown className="w-3 h-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Advanced Proctoring */}
                        <div className="bg-gradient-to-r from-purplePrimary via-pink-500 to-yellow-400 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Advanced Proctoring</h3>
                                    <p className="text-sm opacity-90">
                                        Auto grade your assessments wit AI Auto grade your assessments wit AIAuto grade your assessments wit AIAuto grade your assessments wit AI
                                    </p>
                                </div>
                                <Button className="bg-white text-gray-800 rounded-full px-4 py-2">
                                    <Crown className="w-4 h-4 mr-1" />
                                    Join Pro
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    'Face Detection',
                                    'GPT Detection',
                                    'AI Identity Verification',
                                    'Virtual Machine Detection',
                                    'Browser fingerprinting'
                                ].map((feature) => (
                                    <div key={feature} className="bg-white/20 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <Toggle enabled={false} />
                                            <span className="font-medium">{feature}</span>
                                            <HelpCircle className="w-4 h-4 opacity-70" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Legal Section */}
                <Section
                    id="legal"
                    header="Legal"
                    collapsable={true}
                    collapsed={collapsedSections['legal']}
                    onToggle={() => toggleSectionCollapse('legal')}
                >
                    <div className="space-y-6">
                        {/* Extra Time */}
                        <div className="bg-gray-50 rounded-2xl p-6 border">
                            <h3 className="text-lg font-semibold mb-2">Extra Time</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Qualifying questions are presented to candidates ahead of the tests. The answers to these questions determine if ca, determinedetermine determine determine
                            </p>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border mb-4">
                                <span className="text-gray-700">Time</span>
                                <ChevronDownIcon className="w-4 h-4 ml-auto" />
                            </div>
                            <div className="bg-purpleQuaternary rounded-xl p-4">
                                <p className="text-sm text-gray-700">
                                    Candidates with concentration/ memory impairments Candidates with concentration/ memory impairments Candidates with concentration/ memory impairments Candidates with concentration/ memory impairments. Candidates with concentration.
                                </p>
                            </div>
                        </div>

                        {/* Accommodation for candidates */}
                        <div className="bg-gray-50 rounded-2xl p-6 border">
                            <h3 className="text-lg font-semibold mb-2">Accommodation for candidates</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Qualifying questions are presented to candidates ahead of the tests. The answers to these questions determine if ca, determinedetermine determine determine
                            </p>
                            <div className="bg-white rounded-xl p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium">Non fluent English speakers</span>
                                        <HelpCircle className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <Toggle enabled={true} />
                                </div>
                                <div className="h-px bg-gray-200"></div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium">Candidates with concentration/ memory impairments</span>
                                        <HelpCircle className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <Toggle enabled={false} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
                <Button variant="outline" className="rounded-full px-6 py-2">
                    <ChevronLeftIcon className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Button className="rounded-full px-6 py-2 bg-gray-300 text-gray-500 cursor-not-allowed" disabled>
                    Finish
                </Button>
            </div>
        </div>
    );
};

export default Step4;