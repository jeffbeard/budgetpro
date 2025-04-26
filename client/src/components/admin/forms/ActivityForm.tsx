import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { insertActivitySchema, type Activity } from '@shared/schema';
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
import { Textarea } from '@/components/ui/textarea';

// Enhanced validation schema
const activityFormSchema = insertActivitySchema.extend({
  userId: z.coerce.number().positive('User is required'),
  projectId: z.coerce.number().nullable(),
  type: z.enum(['upload', 'comment', 'add_member', 'update_budget']),
  content: z.string().min(1, 'Content is required').max(500),
});

type ActivityFormData = z.infer<typeof activityFormSchema>;

interface ActivityFormProps {
  data?: Activity;
  onSubmit: (data: ActivityFormData) => void;
  isUpdate: boolean;
  projects: any[];
  users: any[];
}

const ActivityForm: React.FC<ActivityFormProps> = ({ 
  data, onSubmit, isUpdate, projects, users 
}) => {
  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: data ? {
      ...data,
    } : {
      userId: 0,
      projectId: null,
      type: 'comment',
      content: '',
    },
  });

  const handleSubmit = (formData: ActivityFormData) => {
    onSubmit(formData);
  };

  // Format ids to ensure they're numbers or null
  const parseId = (id: string | null): number | null => {
    if (id === 'null') return null;
    if (id === null) return null;
    return parseInt(id);
  };

  const activityTypes = [
    { value: 'upload', label: 'Upload' },
    { value: 'comment', label: 'Comment' },
    { value: 'add_member', label: 'Add Member' },
    { value: 'update_budget', label: 'Budget Update' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseId(value))}
                  defaultValue={field.value ? field.value.toString() : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
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
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project (Optional)</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === 'null' ? null : parseId(value))}
                  defaultValue={field.value !== null ? field.value.toString() : 'null'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="null">No Project</SelectItem>
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
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Activity content or description" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting 
              ? 'Saving...' 
              : isUpdate ? 'Update Activity' : 'Create Activity'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ActivityForm;