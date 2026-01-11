# CRED TRACKER
This project proposes an integrated platform that assists users in managing multiple debts while accounting for the psychological stress associated with repayments. The system enables users to analyze hidden debts, prioritize repayments, and receive structured guidance through rule-based financial logic. The platform is designed to be modular, scalable, and suitable for future fintech integrations.
## Platform link
https://celebrated-churros-dcffb8.netlify.app/ 

login email id : yadavmohanhere@gmail.com 

password : 123456

## Contribution
### Team leadership
- **Team Leader:** **Mohan Yadav**
  - Managed overall planning, feature breakdown, and coordination between frontend and backend work.

## Frontend (UI) — Work & Contributors

### What was done
- Built the complete user interface using **HTML/CSS/JavaScript**.
- Designed the dashboard layout (cards/sections) for bills, EMIs, hidden debts, and credit history.
- Implemented client-side rendering logic (DOM updates) to display data received from backend APIs.
- Handled basic UI interactions (viewing lists, sections, and dashboard updates).

### Contributors  
- **Mohan Yadav**
- **Kuldeep Bhatt**

## Backend (API + DB) — Work & Contributors

### What was done
- Created backend server using **Node.js + Express.js**.
- Designed and implemented REST APIs for authentication and finance data.
- Integrated **MongoDB** for persistent storage (users, bills, EMIs, hidden debts, credit history).
- Implemented authentication and security patterns (JWT-based auth, password hashing using bcrypt).
- Ensured data is fetched user-wise (userId-based filtering).

### Contributors
- **Kartik Singh**
- **Shashank Singh**

---
## How it works

The system allows users to enter their financial and debt-related details through a simple web interface. This information is sent to the backend, where predefined rules are applied to organize debts, prioritize repayments, and generate a structured repayment plan.

The processed data is securely stored and then displayed back to the user in the form of clear summaries and dashboards. Based on repayment schedules and due dates, the system provides timely reminders and guidance to help users stay on track.

The overall flow ensures that users receive practical, understandable insights without relying on automated or autonomous decision-making.
## Implementation Approach

The system follows a structured and modular approach to ensure clarity and ease of execution. Users interact with the platform through a simple interface where they can manually add their financial details or share relevant information through emails such as loan statements or billing notifications.

When emails are provided, the system extracts key information such as lender name, outstanding amount, due date, and payment details using basic parsing rules. This extracted data is reviewed and organized before being added to the user’s debt profile, reducing manual effort and improving accuracy.

All collected data is processed using predefined, transparent rules to organize debts and generate repayment guidance. The processed information is stored securely and presented back to the user through clear summaries and reminders.

The implementation focuses on reliability, ease of understanding, and controlled automation, ensuring that all recommendations remain explainable and user-driven.


## Why this approach
•Keeps the system simple and easy to understand

•Ensures transparent and explainable outputs using rule-based logic

•Reduces development risk and implementation complexity

•Allows modular development and clear team responsibilities

•Improves usability through controlled email parsing

•Avoids reliance on autonomous or black-box decision making

•Supports future scalability and feature expansion

## 🔍 Feature Overview

### Hidden Debt Detection
Detects recurring expenses from bank-related emails and SMS (with consent), such as:
- Subscriptions & memberships  
- Auto-payments & free trials  
- Postpaid and utility bills  

Shows:
- Total hidden debt  
- Category-wise breakdown  
- Monthly financial impact  

**Impact:** More awareness, better savings control, improved credit utilization.

---

### EMI Prioritization Scheduler
When funds are limited, users often pay the wrong EMI first.

CRED TRACKER:
- Sorts EMIs by earliest due date  
- Highlights high-risk EMIs  
- Removes guesswork during repayment  

**Impact:** Fewer missed EMIs, lower penalties, improved payment history.

---

### Bill Due Date Alerts
Instead of post-debit notifications, users receive:
- Clear, calm alerts **before** the due date  
- Due amount and EMI details in advance  

**Impact:** Reduced stress, fewer late payments, better credit score stability.

---

### Credit Score Replay
Turns a confusing 3-digit number into a story.

Shows:
- Missed vs on-time payments  
- High utilization periods  
- Score drops and improvements  

**Impact:** Better understanding, fewer repeated mistakes, long-term financial learning.

---

## 🎨 Design Philosophy & User Well-Being

CRED TRACKER is built to **reduce financial anxiety**, not increase it.

- Calm notifications instead of fear-based alerts  
- Clean and transparent UI  
- Focus on clarity, not pressure  

The goal: **users feel in control, not overwhelmed**.

---

## 🔐 Data Privacy & Ethics

- Strict **opt-in consent**
- Only **bank-related emails & transactional SMS**
- No personal chats, contacts, or non-financial data
- No selling or sharing of user data  

Privacy-first by design.

---

## 🛠️ Tech Stack (Hackathon Prototype)

**Frontend:**  
HTML, CSS, JavaScript (responsive & minimal UI)

**Backend:**  
Node.js, Express.js

**Database:**  
MongoDB / Firebase

**Logic:**  
Rule-based systems for:
- Transaction classification  
- EMI prioritization  
- Due date detection  

*(External data sources simulated for hackathon)*

---
## Scalability

The platform is designed with scalability in mind by keeping different system components loosely coupled and modular. This allows individual parts of the system to be improved or expanded without affecting the overall functionality.

The backend follows a stateless design, enabling multiple instances of the service to run simultaneously as the user base grows. Data storage is structured to support efficient retrieval and future expansion as more users and financial records are added.

Additional features such as integrations with external services, advanced analytics, or notification channels can be incorporated without redesigning the existing system. This approach ensures that the platform can scale gradually while maintaining performance and reliability.
