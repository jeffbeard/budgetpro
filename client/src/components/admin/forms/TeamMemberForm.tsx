import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { insertTeamMemberSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Enhanced validation
const teamMemberFormSchema = insertTeamMemberSchema.extend({
  projectId: z.coerce.number().positive('Project is required'),
  userId: z.coerce.number().positive('User is required'),
});

type TeamMemberFormData = z.infer<typeof teamMemberFormSchema>;

interface TeamMemberFormProps {
  data?: any;
  onSubmit: (data: TeamMemberFormData) => void;
  isUpdate: boolean;
  projects: any[];
  users: any[];
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ 
  data, onSubmit, isUpdate, projects, users 
}) => {
  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: data ? {
      projectId: data.projectId,
      userId: data.userId,
    } : {
      projectId: 0,
      userId: 0,
    },
  });

  const handleSubmit = (formData: TeamMemberFormData) => {
    onSubmit(formData);
  };

  // Format project id to ensure it's a number
  const parseId = (id: string | number): number => {
    if (typeof id === 'string') {
      return parseInt(id);
    }
    return id;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseId(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Member</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseId(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} ({user.title || 'No title'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              : isUpdate ? 'Update Team Member' : 'Add Team Member'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeamMemberForm;