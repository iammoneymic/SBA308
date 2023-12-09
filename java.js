
function getLearnerData(course, assignmentGroup, submissions) {

    if (!course || typeof course.name !== 'string') {
      throw new Error('Invalid input: CourseInfo is missing or has an invalid format.');
    }
  
    if (!assignmentGroup || typeof assignmentGroup.group_weight !== 'number' || !Array.isArray(assignmentGroup.assignments)) {
      throw new Error('Invalid input: AssignmentGroup is missing or has an invalid format.');
    }
  
    if (course.id !== assignmentGroup.course_id) {
      throw new Error('Invalid input: AssignmentGroup does not belong to the specified course.');
    }
  
    const learners = {};
  

    submissions.forEach(submission => {
      const assignment = assignmentGroup.assignments.find(a => a.id === submission.assignment_id);
  

      if (!assignment || typeof assignment.points_possible !== 'number' || assignment.points_possible === 0) {
        console.warn(`Submission ignored: Assignment with ID ${submission.assignment_id} not found in AssignmentGroup or has invalid points_possible.`);
        return;
      }
  

      const dueDate = new Date(assignment.due_at);
      const submittedDate = new Date(submission.submission.submitted_at);
  
      if (submittedDate > dueDate) {

        submission.submission.score -= assignment.points_possible * 0.1;
      }
  
   
      if (!learners[submission.learner_id]) {
        learners[submission.learner_id] = {
          id: submission.learner_id,
          totalScore: 0,
          totalWeight: 0,
          scores: {}
        };
      }
  

      const learner = learners[submission.learner_id];
      learner.totalScore += submission.submission.score;
      learner.totalWeight += assignment.group_weight;
      learner.scores[assignment.id] = (submission.submission.score / assignment.points_possible) || 0;
    });
  

    const result = Object.values(learners).map(learner => {
      const avg = learner.totalScore / learner.totalWeight;
      const formattedResult = {
        id: learner.id,
        avg: isNaN(avg) ? 0 : avg.toFixed(3),
      };
  

      assignmentGroup.assignments.forEach(assignment => {
        const assignmentId = assignment.id;
        if (learner.scores[assignmentId] !== undefined) {
          formattedResult[assignmentId] = isNaN(learner.scores[assignmentId]) ? 0 : learner.scores[assignmentId].toFixed(3);
        }
      });
  
      return formattedResult;
    });
  
    return result;
  }
  

  const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  console.log(result);
  