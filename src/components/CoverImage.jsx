import { Book } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export default function CoverImage({ coverUrl, title = "book image" , size = 64, color="#777" }) {
    const [imgError, setImgError] = useState(false);
    useEffect(() => {
        setImgError(false);
    }, [coverUrl]);
    return coverUrl && !imgError ? (
        <img key={coverUrl} src={coverUrl} alt={title} className="h-full object-cover"
            onError={() => setImgError(true)}
        />
    ) : (
        <div className=' h-full w-full flex justify-center items-center'>
            <Book size={size} color={color} />
        </div>
    )
}
