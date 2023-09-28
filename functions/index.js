/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable one-var */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.toggleTimer = functions.https.onCall(async (data, context) => {
  const { groupId, projectId } = data;

  // groupsコレクションのサブコレクションであるprojectsから指定されたgroupIdとprojectIdを持つドキュメントを参照
  const projectRef = admin
    .firestore()
    .collection("groups")
    .doc(groupId)
    .collection("projects")
    .doc(projectId);

  const snapshot = await projectRef.get();
  const timerData = snapshot.data().timer;

  if (timerData && timerData.status === "playing") {
    const now = admin.firestore.Timestamp.now();
    const elapsedTime = Math.floor(now.seconds - timerData.startTime.seconds);
    const pausedTime = timerData.remainingTime - elapsedTime;

    await projectRef.update({
      timer: {
        ...timerData,
        status: "stopped",
        startTime: null,
        remainingTime: pausedTime,
      },
    });
  } else {
    const now = admin.firestore.Timestamp.now();
    let remainingTime, currentPhase;

    if (timerData && timerData.remainingTime > 0) {
      remainingTime = timerData.remainingTime;
      currentPhase = timerData.currentPhase;
    } else {
      currentPhase = timerData ? timerData.currentPhase + 1 : 0;
      remainingTime = timerData ? timerData.phases[currentPhase].time : 30; // phasesの中のtimeを参照するように変更
    }

    await projectRef.update({
      timer: {
        ...timerData,
        status: "playing",
        startTime: now,
        remainingTime,
        currentPhase,
      },
    });
  }
});

exports.nextPhase = functions.https.onCall(async (data, context) => {
  const { groupId, projectId } = data;

  // groupsコレクションのサブコレクションであるprojectsから指定されたgroupIdとprojectIdを持つドキュメントを参照
  const projectRef = admin
    .firestore()
    .collection("groups")
    .doc(groupId)
    .collection("projects")
    .doc(projectId);

  const snapshot = await projectRef.get();
  const timerData = snapshot.data().timer;

  const currentPhase = timerData ? timerData.currentPhase + 1 : 0;
  const remainingTime = timerData ? timerData.phases[currentPhase].time : 30; // phasesの中のtimeを参照するように変更

  await projectRef.update({
    timer: {
      ...timerData,
      status: "playing",
      startTime: admin.firestore.Timestamp.now(),
      remainingTime,
      currentPhase,
    },
  });
});
