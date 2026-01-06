"use client"

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Inbox, Building2, MapPin, ExternalLink, CalendarClock, X } from "lucide-react" // <--- Added X icon
import { showProfessionalToast } from "@/components/customToast"

const COLUMNS = {
  APPLIED: { id: "APPLIED", title: "Applied", color: "bg-blue-500", lightColor: "bg-blue-50 dark:bg-blue-900/20" },
  INTERVIEW: { id: "INTERVIEW", title: "Interviewing", color: "bg-purple-500", lightColor: "bg-purple-50 dark:bg-purple-900/20" },
  OFFER: { id: "OFFER", title: "Offers", color: "bg-emerald-500", lightColor: "bg-emerald-50 dark:bg-emerald-900/20" },
  REJECTED: { id: "REJECTED", title: "Rejected", color: "bg-red-500", lightColor: "bg-red-50 dark:bg-red-900/20" }
}

export function ApplicationsList({ applications, setApplications }) {

  // 🔥 NEW: Handle Delete Function
  const handleDelete = async (e, appId) => {
    e.stopPropagation(); // Stop drag event from firing
    
    // Optional: Add a simple confirm check
    // if (!confirm("Remove this application?")) return;

    // 1. Optimistic Update (Remove immediately from UI)
    const previousApps = [...applications];
    const newApps = applications.filter(app => app._id !== appId);
    setApplications(newApps);

    try {
        // 2. Call API
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/application/${appId}`, {
            method: 'DELETE',
        });
        const data = await res.json();

        if (!data.success) {
            throw new Error(data.msg || "Failed to delete");
        }
        showProfessionalToast("Application removed");

    } catch (err) {
        console.error("Delete failed", err);
        showProfessionalToast("Failed to remove. Restoring...");
        setApplications(previousApps); // Revert UI if API fails
    }
  };

  if (!applications || applications.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="size-16 rounded-full bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center mb-4">
            <Inbox className="size-8 text-black dark:text-white" />
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
            No applications yet
          </h3>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 text-center">
            Go to "Find Jobs" and swipe right to populate this board.
          </p>
        </CardContent>
      </Card>
    )
  }

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic Update
    const newApps = [...applications];
    const appIndex = newApps.findIndex(a => a._id === draggableId);
    if(appIndex === -1) return;

    const previousApps = JSON.parse(JSON.stringify(applications));
    newApps[appIndex].status = destination.droppableId;
    setApplications(newApps);

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/application/${draggableId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: destination.droppableId })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.msg);
    } catch (err) {
        console.error("Failed to update status", err);
        showProfessionalToast("Failed to save move. Reverting...");
        setApplications(previousApps);
    }
  };

  const getAppsByStatus = (status) => applications.filter(app => app.status === status);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full mb-24">
        
        {Object.values(COLUMNS).map((column) => (
          <div key={column.id} className={`flex flex-col rounded-xl border border-border/50 h-[calc(100vh-240px)] min-h-[500px] ${column.lightColor}`}>
            
            {/* Header */}
            <div className="p-4 border-b border-border/10 flex items-center justify-between">
               <h2 className="font-bold text-sm flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.color}`} />
                  {column.title}
               </h2>
               <Badge variant="secondary" className="bg-white/50 dark:bg-black/20 text-xs">{getAppsByStatus(column.id).length}</Badge>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex-1 p-2 space-y-2 overflow-y-auto"
                >
                  {getAppsByStatus(column.id).map((app, index) => (
                    <Draggable key={app._id} draggableId={app._id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`cursor-grab hover:shadow-md transition-all border-border/50 bg-card group ${snapshot.isDragging ? "shadow-xl ring-2 ring-primary/20 rotate-2 z-50" : ""}`}
                        >
                          <CardContent className="p-3 space-y-2">
                            {/* Title & Actions Row */}
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-semibold text-sm truncate leading-tight flex-1" title={app.jobId?.title}>
                                    {app.jobId?.title || "Unknown Role"}
                                </h3>
                                
                                {/* Action Buttons Container */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* External Link */}
                                    {app.jobId?.applyUrl && (
                                        <a 
                                            href={app.jobId.applyUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-blue-500 transition-colors"
                                            title="View on LinkedIn"
                                        >
                                            <ExternalLink className="size-3.5" />
                                        </a>
                                    )}

                                    {/* 🔥 DELETE BUTTON */}
                                    <button 
                                        onClick={(e) => handleDelete(e, app._id)}
                                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md text-zinc-400 hover:text-red-500 transition-colors"
                                        title="Remove Application"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Building2 className="size-3" />
                                <span className="truncate max-w-[120px]">{app.jobId?.company || "Unknown"}</span>
                            </div>
                            
                            <div className="pt-2 flex items-center justify-between border-t border-border/30 mt-1">
                               <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                   <CalendarClock className="size-3" />
                                   {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                               </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}

      </div>
    </DragDropContext>
  )
}