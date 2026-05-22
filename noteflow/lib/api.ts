const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://noteflow-api-sigma.vercel.app/api';

export async function getNotes() {
    const res = await fetch(`${BASE_URL}/notes`);
    if(!res.ok) {
        throw new Error('Error al cargar notas');
    } 
    return res.json();
}

export async function getNoteById(id: string) {
    const res = await fetch(`${BASE_URL}/notes/${id}`);
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
        headers: {
            'Content-Type': 'application/json' 
        },
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
        headers: {
            'Content-Type': 'application/json'
        },
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
    });
    if(!res.ok) {
        throw new Error('Error al eliminar nota');
    }
}

export async function getChecklists() {
    const res = await fetch(`${BASE_URL}/checklists`);
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
        headers: {
            'Content-Type': 'application/json'
        },
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
        headers: {
            'Content-Type': 'application/json'
        },
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
    })
    if(!res.ok) {
        throw new Error('Error al eliminar item');
    }
}

export async function createChecklistItem(checklistId: string, text: string) {
    const res = await fetch(`${BASE_URL}/checklists/${checklistId}/checklist-items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    if(!res.ok) {
        throw new Error('Error al actualizar el item');
    }
    return res.json();
}

export async function deleteChecklistItem(itemId: string) {
    const res = await fetch(`${BASE_URL}/checklist-items/${itemId}`, { method: 'DELETE' });
    if(!res.ok) {
        throw new Error('Error al eliminar item')
    }
}

export async function getIdeas() {
    const res = await fetch(`${BASE_URL}/ideas`);
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
        headers: {
            'Content-Type': 'application/json'
        },
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
        headers: {
            'Content-Type': 'application/json'
        },
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
    })
    if(!res.ok) {
        throw new Error('Error al eliminar idea');
    }
}

export async function createTag(ideaId: string, text: string) {
    const res = await fetch(`${BASE_URL}/notes/${ideaId}/tags`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
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
    });
    if (!res.ok) {
        throw new Error('Error al eliminar tag');
    }
}