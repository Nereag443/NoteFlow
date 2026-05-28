const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://noteflow-api-sigma.vercel.app/api';

import { getToken } from "./auth";

export async function authHeaders(){
    const token = await getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}`}: {}),
    }
}

export async function getNotes() {
    const res = await fetch(`${BASE_URL}/notes`, {
        headers: await authHeaders(),
    });
    if(!res.ok) {
        throw new Error('Error al cargar notas');
    } 
    return res.json();
}

export async function getNoteById(id: string) {
    const res = await fetch(`${BASE_URL}/notes/${id}`, {
        headers: await authHeaders(),
    });
    if (!res.ok) {
        throw new Error('Error al cargar nota');
    }
    return res.json();
}

export async function createNote(data: {
    title: string;
    content?: string;
    archived?: boolean;
}) {
    const res = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({ ...data, type: 'note' }),
    });
    if(!res.ok) {
        throw new Error('Error al crear nota');
    }
    return res.json();
}

export async function updateNote(id: string, data: {
    title?: string;
    content?: string;
    archived?: boolean;
}) {
    const res = await fetch(`${BASE_URL}/notes/${id}`, {
        method: 'PATCH',
        headers: await authHeaders(),
        body: JSON.stringify(data),
    });
    if(!res.ok) {
        throw new Error('Error al actualizar nota');
    }
    return res.json();
}

export async function deleteNote(id: string) {
    const res = await fetch(`${BASE_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: await authHeaders(),
    });
    if(!res.ok) {
        throw new Error('Error al eliminar nota');
    }
}

export async function getChecklists() {
    const res = await fetch(`${BASE_URL}/checklists`, {
        headers: await authHeaders(),
    });
    if (!res.ok) {
        throw new Error('Error al cargar checklists');
    }
    return res.json();
}

export async function createChecklist(data: {
    title: string;
    priority?: 'low' | 'medium' | 'high';
    archived?: boolean;
}) {
    const res = await fetch(`${BASE_URL}/checklists`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify(data),
    })
    if(!res.ok) {
        throw new Error('Error al crear item')
    }
    return res.json();
}

export async function updateChecklist(id: string, data: {
    title?: string;
    priority?: 'low' | 'medium' | 'high';
    archived?: boolean;
}) {
    const res = await fetch(`${BASE_URL}/checklists/${id}`, {
        method: 'PATCH',
        headers: await authHeaders(),
        body: JSON.stringify(data),
    })
    if(!res.ok) {
        throw new Error('Error al actualizar checklist')
    }
    return res.json();
}

export async function deleteChecklist(id: string) {
    const res = await fetch(`${BASE_URL}/checklists/${id}`, {
        method: 'DELETE',
        headers: await authHeaders(),
    })
    if(!res.ok) {
        throw new Error('Error al eliminar item');
    }
}

export async function createChecklistItem(checklistId: string, text: string) {
    const res = await fetch(`${BASE_URL}/checklists/${checklistId}/checklist-items`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({ text }),
    });
    if(!res.ok) {
        throw new Error('Error al crear item');
    }
    return res.json();
}

export async function updateChecklistItem(itemId: string, data: {
    text?: string;
    is_completed?: boolean;
}) {
    const res = await fetch(`${BASE_URL}/checklist-items/${itemId}`, {
        method: 'PATCH',
        headers: await authHeaders(),
        body: JSON.stringify(data),
    });
    if(!res.ok) {
        throw new Error('Error al actualizar el item');
    }
    return res.json();
}

export async function deleteChecklistItem(itemId: string) {
    const res = await fetch(`${BASE_URL}/checklist-items/${itemId}`, { 
        method: 'DELETE', 
        headers: await authHeaders(),
    });
    if(!res.ok) {
        throw new Error('Error al eliminar item')
    }
}

export async function getIdeas() {
    const res = await fetch(`${BASE_URL}/ideas`, {
        headers: await authHeaders(),
    });
    if(!res.ok) {
        throw new Error('Error al cargar ideas');
    }
    return res.json();
}

export async function createIdea(data: {
    title: string;
    color?: string;
    archived?: boolean;
    tags?: string[];
}) {
    const res = await fetch(`${BASE_URL}/ideas`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify(data),
    });
    if(!res.ok) {
        throw new Error('Error al crear idea');
    }
    return res.json();
}

export async function updateIdea(id: string, data: {
    title?: string;
    color?: string;
    archived?: boolean;
}) {
    const res = await fetch(`${BASE_URL}/ideas/${id}`, {
        method: 'PATCH',
        headers: await authHeaders(),
        body: JSON.stringify(data),
    });
    if(!res.ok) {
        throw new Error('Error al actualizar idea');
    }
    return res.json();
}

export async function deleteIdea(id: string) {
    const res = await fetch(`${BASE_URL}/ideas/${id}`, {
        method: 'DELETE',
        headers: await authHeaders(),
    })
    if(!res.ok) {
        throw new Error('Error al eliminar idea');
    }
}

export async function createTag(ideaId: string, text: string) {
    const res = await fetch(`${BASE_URL}/notes/${ideaId}/tags`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({ text }),
    });
    if (!res.ok) { 
        throw new Error('Error al crear tag');
    }
    return res.json();
}

export async function deleteTag(tagId: string) {
    const res = await fetch(`${BASE_URL}/tags/${tagId}`, {
        method: 'DELETE',
        headers: await authHeaders(),
    });
    if (!res.ok) {
        throw new Error('Error al eliminar tag');
    }
}

export async function getPresignedUrl(fileName: string, contentType: string){
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
        const res = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            headers: await authHeaders(),
            body: JSON.stringify({ fileName, contentType }),
            signal: controller.signal,
        });
        if(!res.ok){
            throw new Error('Error al obtener URL de subida');
        }
        return res.json();
    }catch(e){
        clearTimeout(timeout);
        console.log('fetch error:', e);
        throw e;
    }
}


export async function uploadToS3(signedUrl: string, localUri: string){
    const res = await fetch(localUri);
    const blob = await res.blob();
    await fetch(signedUrl, {
        method: 'PUT',
        body: blob,
        headers: { 'Content-Type': 'image/jpeg' },
    });
}

export async function deleteAvatar(key: string){
    const res = await fetch(`${BASE_URL}/avatar`, {
        method: 'DELETE',
        headers: await authHeaders(),
        body: JSON.stringify({ key }),
    });
    if(!res.ok) {
        throw new Error('Error al eliminar avatar');
    }
}