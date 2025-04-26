import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Button
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle, Plus, Pencil, Trash2 } from 'lucide-react';

interface DataTableProps<T> {
  data: T[];
  columns: { key: string; label: string; render?: (row: T) => React.ReactNode }[];
  title: string;
  apiEndpoint: string;
  queryKey: string | any[];
  formComponent: React.ComponentType<{ 
    data?: T; 
    onSubmit: (formData: any) => void; 
    isUpdate: boolean;
  }>;
}

export default function DataTable<T extends { id: number }>({
  data,
  columns,
  title,
  apiEndpoint,
  queryKey,
  formComponent: FormComponent,
}: DataTableProps<T>) {
  const [selectedItem, setSelectedItem] = useState<T | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: (formData: any) => {
      return apiRequest({
        url: apiEndpoint,
        method: 'POST',
        data: formData
      });
    },
    onSuccess: () => {
      toast({
        title: 'Created successfully',
        description: 'The record was created successfully',
      });
      setIsFormDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast({
        title: 'Error creating record',
        description: 'There was an error creating the record',
        variant: 'destructive',
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (formData: any) => {
      return apiRequest({
        url: `${apiEndpoint}/${selectedItem?.id}`,
        method: 'PATCH',
        data: formData
      });
    },
    onSuccess: () => {
      toast({
        title: 'Updated successfully',
        description: 'The record was updated successfully',
      });
      setIsFormDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: 'Error updating record',
        description: 'There was an error updating the record',
        variant: 'destructive',
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: () => {
      return apiRequest({
        url: `${apiEndpoint}/${selectedItem?.id}`,
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      toast({
        title: 'Deleted successfully',
        description: 'The record was deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: 'Error deleting record',
        description: 'There was an error deleting the record',
        variant: 'destructive',
      });
    }
  });
  
  const handleCreate = () => {
    setSelectedItem(undefined);
    setIsUpdate(false);
    setIsFormDialogOpen(true);
  };
  
  const handleUpdate = (item: T) => {
    setSelectedItem(item);
    setIsUpdate(true);
    setIsFormDialogOpen(true);
  };
  
  const handleDelete = (item: T) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  const handleFormSubmit = (formData: any) => {
    if (isUpdate) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };
  
  const confirmDelete = () => {
    deleteMutation.mutate();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button onClick={handleCreate} className="flex items-center gap-1">
          <Plus size={16} />
          <span>Add New</span>
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-6">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={`${item.id}-${column.key}`}>
                      {column.render ? column.render(item) : (item as any)[column.key]}
                    </TableCell>
                  ))}
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUpdate(item)}
                      className="inline-flex items-center gap-1"
                    >
                      <Pencil size={14} />
                      <span>Edit</span>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(item)}
                      className="inline-flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isUpdate ? 'Update' : 'Create'} {title}</DialogTitle>
            <DialogDescription>
              Fill in the details below to {isUpdate ? 'update' : 'create'} a record.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FormComponent 
              data={selectedItem} 
              onSubmit={handleFormSubmit} 
              isUpdate={isUpdate} 
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive" size={20} />
              <span>Confirm Deletion</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}