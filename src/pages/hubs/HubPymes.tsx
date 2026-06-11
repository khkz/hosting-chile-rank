import React from 'react';
import IntentHub from '@/components/hubs/IntentHub';
import { HUBS } from '@/lib/segmentHubs';
const HubPymes = () => <IntentHub config={HUBS.pymes} />;
export default HubPymes;
