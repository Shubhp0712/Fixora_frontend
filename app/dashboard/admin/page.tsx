'use client';

import { useAuth } from '@/components/AuthProvider';

export default function AdminPage() {
    const { can, session } = useAuth();

    if (!can('admin:access')) {
        return (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                <h1 className="text-xl font-semibold text-amber-900">Restricted Area</h1>
                <p className="mt-2 text-sm text-amber-800">
                    Your role does not have access to admin features for this organization.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Controls</h1>
                <p className="text-gray-600 mt-1">
                    Organization: {session?.user.organizationName} ({session?.user.organizationId})
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h2 className="font-semibold text-gray-900">User Provisioning</h2>
                    <p className="mt-2 text-sm text-gray-600">Invite, deactivate, and manage organization users.</p>
                    <button disabled className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-500 cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h2 className="font-semibold text-gray-900">Policy Management</h2>
                    <p className="mt-2 text-sm text-gray-600">Configure SLA policy, escalation rules, and queues.</p>
                    <button disabled className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-500 cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>
            </div>
        </div>
    );
}
