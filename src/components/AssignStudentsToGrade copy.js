"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { ScrollArea } from "src/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import axios from "axios";

const SortableItem = ({ id, name, email }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-2 p-2 bg-white rounded shadow flex items-center space-x-2 cursor-move"
    >
      <Avatar>
        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`} />
        <AvatarFallback>{name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
      </Avatar>
      <div>
        <div>{name}</div>
        <div className="text-sm text-gray-500">{email}</div>
      </div>
    </div>
  );
};

export default function AssignStudentsToGrade() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [grades, setGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gradesResponse = await axios.get("http://localhost:8080/grades");
        setGrades(gradesResponse.data);
        setSelectedGrade(gradesResponse.data[0]?._id || null);

        const studentsResponse = await axios.get("http://localhost:8080/user/students");
        setStudents(studentsResponse.data);
        setFilteredStudents(studentsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setStudents((items) => {
        const activeIndex = items.findIndex((item) => item._id === active.id);
        const overIndex = items.findIndex((item) => item._id === over.id);
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredStudents(
      students.filter(
        (student) =>
          (student?.username?.toLowerCase() || "").includes(term) ||
          (student?.email?.toLowerCase() || "").includes(term)
      )
    );
  };

  const handleAssignStudents = async () => {
    try {
      const studentsToAssign = students
        .filter((student) => student.grade?.gradeId === selectedGrade)
        .map((student) => student._id);

      if (studentsToAssign.length === 0) {
        alert("No students selected for assignment.");
        return;
      }

      await axios.post(
        `http://localhost:8080/grades/${selectedGrade}/students`,
        { gradeId: selectedGrade, studentIds: studentsToAssign },
        { withCredentials: true }
      );

      alert("Students successfully assigned to the grade.");
    } catch (error) {
      console.error("Error assigning students:", error);
      alert("Failed to assign students. Please try again.");
    }
  };

  const unassignedStudents = filteredStudents.filter((student) => !student.grade?.gradeName);
  const assignedToOtherGrades = filteredStudents.filter(
    (student) => student.grade?.gradeName && student.grade.gradeId !== selectedGrade
  );
  const studentsInSelectedGrade = filteredStudents.filter(
    (student) => student.grade?.gradeId === selectedGrade
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Assign Students to Grade</h1>
      <div className="mb-4 flex space-x-4">
        <Select onValueChange={setSelectedGrade} value={selectedGrade}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a grade" />
          </SelectTrigger>
          <SelectContent>
            {grades.map((grade) => (
              <SelectItem key={grade._id} value={grade._id}>
                {grade.gradeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Search students by name or email"
          value={searchTerm}
          onChange={handleSearch}
          className="flex-grow"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <Card>
            <CardHeader>
              <CardTitle>Unassigned Students</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <SortableContext items={unassignedStudents} strategy={verticalListSortingStrategy}>
                  {unassignedStudents.map((student) => (
                    <SortableItem key={student._id} id={student._id} name={student.username} email={student.email} />
                  ))}
                </SortableContext>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Assigned to Other Grades</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <SortableContext items={assignedToOtherGrades} strategy={verticalListSortingStrategy}>
                  {assignedToOtherGrades.map((student) => (
                    <SortableItem key={student._id} id={student._id} name={student.username} email={student.email} />
                  ))}
                </SortableContext>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {grades.find((g) => g._id === selectedGrade)?.gradeName || "Selected Grade"} Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <SortableContext items={studentsInSelectedGrade} strategy={verticalListSortingStrategy}>
                  {studentsInSelectedGrade.map((student) => (
                    <SortableItem key={student._id} id={student._id} name={student.username} email={student.email} />
                  ))}
                </SortableContext>
              </ScrollArea>
            </CardContent>
          </Card>
        </DndContext>
      </div>
      <div className="mt-4 flex justify-end space-x-4">
        <Button onClick={handleAssignStudents}>Assign Selected Students</Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
