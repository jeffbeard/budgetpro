import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ProjectsAdmin from "@/components/admin/ProjectsAdmin";
import UsersAdmin from "@/components/admin/UsersAdmin";
import TeamMembersAdmin from "@/components/admin/TeamMembersAdmin";
import DeadlinesAdmin from "@/components/admin/DeadlinesAdmin";
import ResourcesAdmin from "@/components/admin/ResourcesAdmin";
import BudgetDataAdmin from "@/components/admin/BudgetDataAdmin";
import ActivitiesAdmin from "@/components/admin/ActivitiesAdmin";
import { useLocation } from "wouter";

export default function Admin() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("projects");

  // Set the active tab based on the query parameter in the URL
  useEffect(() => {
    // Get URL search params
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');

    if (tabParam && ["projects", "users", "team", "deadlines", "resources", "budget", "activities"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

  // Update the URL query parameter when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL without reloading the page
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.pushState({}, '', url);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your application data securely</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Create, read, update, and delete data in your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="team">Team Members</TabsTrigger>
              <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="budget">Budget Data</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
            <TabsContent value="projects">
              <ProjectsAdmin />
            </TabsContent>
            <TabsContent value="users">
              <UsersAdmin />
            </TabsContent>
            <TabsContent value="team">
              <TeamMembersAdmin />
            </TabsContent>
            <TabsContent value="deadlines">
              <DeadlinesAdmin />
            </TabsContent>
            <TabsContent value="resources">
              <ResourcesAdmin />
            </TabsContent>
            <TabsContent value="budget">
              <BudgetDataAdmin />
            </TabsContent>
            <TabsContent value="activities">
              <ActivitiesAdmin />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}