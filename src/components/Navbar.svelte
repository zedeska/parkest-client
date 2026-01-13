<script lang="ts">
    import { goto } from "@mateothegreat/svelte5-router";
    import { UserContent } from '../stores/userStore'; // Import du store
    import { User } from '../user';
    export let open: boolean = false;
    function logout() {
        localStorage.removeItem('user');
        UserContent.set(new User(136, false, false, false, false));
        open = false;
        goto("/");
    }
</script>

<nav class="absolute left-1 top-6 z-20 bg-white p-3 rounded-md flex gap-6 shadow-md mt-[env(safe-area-inset-top)]">    <button class="cursor-pointer" on:click={() => open = !open}>
        <i class="fa-solid fa-bars"></i>
    </button>
    <button class="cursor-pointer" on:click={() => goto("/")}>
        <i class="fa-solid fa-house"></i>
    </button>
</nav>

<aside class:open class="bg-black/50 w-full h-full" on:click={() => open = false}>
    <div class="w-2/3 md:w-1/4 p-4 rounded-r-lg bg-white h-full flex flex-col shadow-xl" on:click|stopPropagation>
        <div class="flex justify-between items-center mb-6">
            <h2 class="font-bold text-xl">Menu</h2>
            <button class="cursor-pointer text-xl" on:click={() => open = false}>
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <div class="flex flex-col gap-4 border-t border-b py-4 mb-4">
            <p class="text-sm font-semibold text-gray-500 uppercase">Mes Filtres</p>
            
            <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
                <input type="checkbox" bind:checked={$UserContent.pmr} on:change={() => $UserContent.updateParams()} class="w-5 h-5" />
                <span><i class="fa-solid fa-wheelchair text-blue-500 w-6"></i> Accès PMR</span>
            </label>

            <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
                <input type="checkbox" bind:checked={$UserContent.free} on:change={() => $UserContent.updateParams()} class="w-5 h-5" />
                <span><i class="fa-solid fa-hand-holding-dollar text-green-500 w-6"></i> Gratuit</span>
            </label>

            <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
                <input type="checkbox" bind:checked={$UserContent.elec} on:change={() => $UserContent.updateParams()} class="w-5 h-5" />
                <span><i class="fa-solid fa-bolt text-yellow-500 w-6"></i> Électrique</span>
            </label>
        </div>

        <div class="mt-auto">
             <button 
                on:click={logout}
                  class="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer font-semibold"
               >
                 <i class="fa-solid fa-right-from-bracket"></i>
                 Déconnexion
            </button>
        </div>
    </div>
</aside>

<style>
    aside {
        transition: opacity 0.3s ease-in-out;
        left: -100%;
        position: absolute;
        z-index: 40;
        opacity: 0;
    }

    .open {
        left: 0;
        opacity: 1;
    }
</style>
