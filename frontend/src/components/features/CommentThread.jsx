import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useComments, useCreateComment } from "../../hooks/useComments";
import { canViewInternalNotes } from "../../permissions";
import Button from "../ui/Button";

export default function CommentThread({ ticketId }) {
    const { user } = useAuth();
    const { data: comments, isLoading } = useComments(ticketId);
    const createComment = useCreateComment(ticketId);
    const [body, setBody] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const canPostInternal = canViewInternalNotes(user);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!body.trim()) return;
        await createComment.mutateAsync({ body, is_internal: isInternal });
        setBody('');
        setIsInternal(false);
    }

    if (isLoading) return <p className="text-sm text-muted">Loading comments…</p>;

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {comments?.length ? comments.map((c) => (
                <div
                    key={c.id}
                    className={`border rounded-md p-3 text-sm ${
                    c.is_internal ? 'bg-orange/5 border-orange/30' : 'bg-white border-border'
                    }`}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs">{c.author?.full_name || 'Unknown'}</span>
                        <div className="flex items-center gap-2">
                            {c.is_internal && (
                            <span className="text-[10px] font-bold text-orange uppercase tracking-wide">Internal</span>
                            )}
                            <span className="text-[11px] text-muted">{new Date(c.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                    <p className="text-ink">{c.body}</p>
                </div>
                )) : (
                <p className="text-sm text-muted">No comments yet.</p>
                )}
            </div>

            <form  onSubmit={handleSubmit} className="border-t border-border pt-4 space-y-2">
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Add a comment…"
                    rows={3}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-navy"
                />
                <div className="flex items-center justify-between">
                    {canPostInternal ? (
                        <label className="flex items-center gap-2 text-xs text-muted">
                            <input 
                                type="checkbox"
                                checked={isInternal}
                                onChange={(e) => setIsInternal(e.target.checked)}
                            />
                            Internal note (not visible to employee)
                        </label>
                    ) : <span />}
                    <Button type="submit" disabled={createComment.isPending}>
                        {createComment.isPending ? 'Posting...' : 'Post Comment'}
                    </Button>
                </div>
            </form>
        </div>
    );
}