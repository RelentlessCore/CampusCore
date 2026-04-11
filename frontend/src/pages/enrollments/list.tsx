import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { ShowButton } from "@/components/refine-ui/buttons/show";

type EnrollmentListItem = {
  id: number;
  studentId: string;
  classId: number;
  createdAt: string;
  class?: {
    id: number;
    name: string;
    status: string;
    inviteCode: string;
  };
  subject?: {
    id: number;
    name: string;
    code: string;
  };
  department?: {
    id: number;
    name: string;
    code: string;
  };
  teacher?: {
    id: string;
    name: string;
    email: string;
  };
};

const EnrollmentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const enrollmentColumns = useMemo<ColumnDef<EnrollmentListItem>[]>(
    () => [
      {
        id: "class",
        accessorKey: "class.name",
        size: 240,
        header: () => <p className="column-title">Class</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground font-medium">
            {getValue<string>() ?? "Unknown"}
          </span>
        ),
      },
      {
        id: "subject",
        accessorKey: "subject.name",
        size: 180,
        header: () => <p className="column-title">Subject</p>,
        cell: ({ getValue }) => {
          const name = getValue<string>();
          return name ? (
            <Badge variant="secondary">{name}</Badge>
          ) : (
            <span className="text-muted-foreground">Unknown</span>
          );
        },
      },
      {
        id: "department",
        accessorKey: "department.name",
        size: 160,
        header: () => <p className="column-title">Department</p>,
        cell: ({ getValue }) => {
          const name = getValue<string>();
          return name ? (
            <Badge variant="outline">{name}</Badge>
          ) : (
            <span className="text-muted-foreground">Unknown</span>
          );
        },
      },
      {
        id: "teacher",
        accessorKey: "teacher.name",
        size: 180,
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">
            {getValue<string>() ?? "Unknown"}
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "class.status",
        size: 120,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <Badge variant={status === "active" ? "default" : "secondary"}>
              {status ?? "unknown"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        size: 180,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <ShowButton
              resource="classes"
              recordItemId={row.original.classId}
              variant="outline"
              size="sm"
            >
              View Class
            </ShowButton>
            <DeleteButton
              resource="enrollments"
              recordItemId={row.original.id}
              size="sm"
            />
          </div>
        ),
      },
    ],
    []
  );

  const searchFilters = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const enrollmentsTable = useTable<EnrollmentListItem>({
    columns: enrollmentColumns,
    refineCoreProps: {
      resource: "enrollments",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [...searchFilters],
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Enrollments</h1>

      <div className="intro-row">
        <p>View and manage all student enrollments across classes.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by class name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => navigate("/enrollments/join")}
            >
              Join by Invite Code
            </Button>
            <Button onClick={() => navigate("/enrollments/create")}>
              + Enroll
            </Button>
          </div>
        </div>
      </div>

      <DataTable table={enrollmentsTable} />
    </ListView>
  );
};

export default EnrollmentsList;
