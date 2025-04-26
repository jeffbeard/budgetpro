import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { insertDeadlineSchema, type Deadline } from '@shared/schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

// Enhanced validation schema
const deadlineFormSchema = insertDeadlineSchema.extend({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  projectId: z.coerce.number().nullable(),
  category: z.string().min(2, 'Category must be at least 2 characters').max(50).nullable(),
  date: z.coerce.date(),
  priority: z.enum(['urgent', 'this_week', 'next_week', 'upcoming']),
});

type DeadlineFormData = z.infer<typeof deadlineFormSchema>;

interface DeadlineFormProps {
  data?: Deadline;
  onSubmit: (data: DeadlineFormData) => void;
  isUpdate: boolean;
  projects: any[];
}

const DeadlineForm: React.FC<DeadlineFormProps> = ({ 
  data, onSubmit, isUpdate, projects 
}) => {
  const form = useForm<DeadlineFormData>({
    resolver: zodResolver(deadlineFormSchema),
    defaultValues: data ? {
      ...data,
      // Convert string dates to Date objects
      date: data.date instanceof Date ? data.date : new Date(data.date),
    } : {
      title: '',
      projectId: null,
      category: '',
      date: new Date(),
      priority: 'upcoming',
    },
  });

  const handleSubmit = (formData: DeadlineFormData) => {
    onSubmit(formData);
  };

  // Format project id to ensure it's a number or null
  const parseProjectId = (id: string | null): number | null => {
    if (id === 'null') return null;
    if (id === null) return null;
    return parseInt(id);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Budget Review" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === 'null' ? null : parseProjectId(value))}
                  defaultValue={field.value !== null ? field.value.toString() : 'null'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="null">All Projects</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Finance" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    value={field.value instanceof Date ? format(field.value, 'yyyy-MM-dd') : ''}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="this_week">This Week</SelectItem>
                    <SelectItem value="next_week">Next Week</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting 
              ? 'Saving...' 
              : isUpdate ? 'Update Deadline' : 'Create Deadline'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DeadlineForm;