/**
 * Layout Components for Workflow Approve
 * Handles the rendering of Top Bar and Sidebar across the application.
 */

const layoutConfig = {
    appName: 'Workflow Approve',
    primaryColor: 'var(--color-primary)',
};

async function fetchUserProfile(userId, supabaseClient) {
    try {
        const { data, error } = await supabaseClient
            .from('users')
            .select(`
                firstname, 
                lastname, 
                departments(deptnameeng)
            `)
            .eq('id', userId)
            .single();

        if (error) throw error;

        return {
            fullName: `${data.firstname} ${data.lastname}`,
            deptName: data.departments?.deptnameeng || 'N/A'
        };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return {
            fullName: 'Unknown User',
            deptName: 'Unknown Department'
        };
    }
}

async function initLayout(user, supabaseClient) {
    const profile = await fetchUserProfile(user.id, supabaseClient);
    renderSidebar();
    renderTopBar(profile, supabaseClient);
    // Initialize Lucide icons after rendering components
    if (window.lucide) {
        lucide.createIcons();
    }
}

function renderSidebar() {
    const sidebarContainer = document.getElementById('sidebar');
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = `
        <div class="flex flex-col h-full bg-white border-r border-gray-200 w-64 transition-all duration-300">
            <div class="p-6 border-b border-gray-100">
                <div class="flex items-center gap-2 text-primary font-bold text-xl">
                    <i data-lucide="clipboard-check" class="w-6 h-6"></i>
                    <span>${layoutConfig.appName}</span>
                </div>
            </div>
            
            <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Main Menu</p>
                
                <a href="index.html" class="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-mint-bg hover:text-primary rounded-lg transition-all group">
                    <i data-lucide="home" class="w-5 h-5 text-gray-400 group-hover:text-primary"></i>
                    <span class="font-medium">Dashboard</span>
                </a>
                
                <a href="#" class="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-mint-bg hover:text-primary rounded-lg transition-all group">
                    <i data-lucide="file-text" class="w-5 h-5 text-gray-400 group-hover:text-primary"></i>
                    <span class="font-medium">My Documents</span>
                </a>
                
                <a href="#" class="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-mint-bg hover:text-primary rounded-lg transition-all group">
                    <i data-lucide="check-square" class="w-5 h-5 text-gray-400 group-hover:text-primary"></i>
                    <span class="font-medium">Pending Approvals</span>
                </a>
                
                <a href="#" class="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-mint-bg hover:text-primary rounded-lg transition-all group">
                    <i data-lucide="settings" class="w-5 h-5 text-gray-400 group-hover:text-primary"></i>
                    <span class="font-medium">Settings</span>
                </a>
            </nav>
            
            <div class="p-4 border-t border-gray-100">
                <div class="bg-gray-50 p-3 rounded-xl text-xs text-gray-500">
                    <p class="font-semibold mb-1">Version 1.0.0</p>
                    <p>Workflow Approve System</p>
                </div>
            </div>
        </div>
    `;
}

function renderTopBar(profile, supabaseClient) {
    const topBarContainer = document.getElementById('top-bar');
    if (!topBarContainer) return;

    topBarContainer.innerHTML = `
        <div class="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-4">
                <button id="toggle-sidebar" class="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md">
                    <i data-lucide="menu" class="w-6 h-6"></i>
                </button>
                <h1 class="text-lg font-semibold text-gray-800">Dashboard</h1>
            </div>
            
            <div class="flex items-center gap-4">
                <div class="hidden sm:flex flex-col text-right mr-2">
                    <span class="text-sm font-bold text-gray-700">${profile.fullName}</span>
                    <span class="text-xs text-gray-400">${profile.deptName}</span>
                </div>
                <button onclick="handleSignOut()" 
                        class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all border border-red-100">
                    <i data-lucide="log-out" class="w-4 h-4"></i>
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    `;
}

async function handleSignOut() {
    try {
        await supabaseClient.auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error signing out:', error);
        alert('เกิดข้อผิดพลาดในการออกจากระบบ');
    }
}
