export const handleCommentLike = (comments: any[], index: number, setComments: (comments: any[]) => void) => {
    const updatedComments = [...comments];
    updatedComments[index].likes += 1;
    setComments(updatedComments);
};

export const handleCommentDislike = (comments: any[], index: number, setComments: (comments: any[]) => void) => {
    const updatedComments = [...comments];
    updatedComments[index].dislikes += 1;
    setComments(updatedComments);
};

export const formatComment = (comment: string) => {
    return comment.replace(/\n/g, '<br />').replace(/\u00a0/g, '&nbsp;');
};

export const handleCommentLikeWrapper = (comments: any[], index: number, setComments: (comments: any[]) => void) => {
    handleCommentLike(comments, index, setComments);
};

export const handleCommentDislikeWrapper = (comments: any[], index: number, setComments: (comments: any[]) => void) => {
    handleCommentDislike(comments, index, setComments);
};

export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const isColorDark = (color: string) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
};