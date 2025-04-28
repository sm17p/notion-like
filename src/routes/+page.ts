import type { PageLoad } from './$types';
import DB from '$lib/db/index.svelte';


export const load: PageLoad = ({ params }) => {
    return {
        notes: DB.getUserNotes(),
    };
};
