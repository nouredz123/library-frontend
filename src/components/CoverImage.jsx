import { Book } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export default function CoverImage({ coverUrl, title = "book image" }) {
    const [imgError, setImgError] = useState(false);
    useEffect(() => {
        setImgError(false);
    }, [coverUrl]);
    return coverUrl && !imgError ? (
        <img key={coverUrl} src={coverUrl} alt={title} className="h-full object-cover"
            onError={() => setImgError(true)}
        />
    ) : (
        <Book size={64} color='#6b7280' />
    )
}
