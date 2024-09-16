import React from "react";
import NotificationsList from "@/components/Notifications/NotificationsList";

const Notifications: React.FC = () => {
  return (
    <div className="mt-4 mb-4 space-y-4">
      <section className="section align-center mb-5">
        <h3 className="mb-2 text-3xl font-extrabold leading-none tracking-tight text-gray-700 md:text-3xl lg:text-4xl dark:text-white text-center">
        Notifications Based on {" "}
          <span className="text-green-600 dark:text-green-500">Your Activity</span> on The
          App.
        </h3>
      </section>
      <NotificationsList />
    </div>
  );
};

export default Notifications;
