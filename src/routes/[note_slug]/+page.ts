import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import DB from '$lib/db/index.svelte';


export const load: PageLoad = ({ params }) => {
    
    if (DB.has(params.note_slug)) {
        const note = DB.getUserNote(params.note_slug);
        return {
            note,
        };
    }
    
    redirect(307, '/');
};
