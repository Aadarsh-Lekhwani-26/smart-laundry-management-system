# Smart Laundry Management System

**Development of an Affordable and Smart Laundry Service Management System with Doorstep Pickup, Delivery Tracking, and Garment Loss Prevention**

A desktop application project developed as part of the Integrated Software Development (ISD) minor subject.

## 1. Project Overview

The Smart Laundry Management System aims to simplify laundry service operations through a desktop application that supports order management, transparent pricing, order status tracking, doorstep pickup and delivery coordination, and systematic garment management.

The project focuses on improving operational efficiency, customer convenience, pricing transparency, and accountability throughout the laundry process. A key objective is to help laundry businesses identify garment quantity discrepancies and reduce the risk of undetected garment loss.

The application is planned as a React + Electron desktop application with local data persistence.

## 2. Problem Statement

Traditional laundry services often involve high washing costs, minimum order requirements, separate ironing charges, inconvenient pickup and delivery, and risks of garment loss or damage.

This project aims to develop an affordable, technology-enabled laundry service management system that provides transparent pricing, flexible order quantities, convenient doorstep pickup and delivery, order tracking, and systematic garment management to improve customer convenience, reliability, and satisfaction.

## 3. Project Objectives

The primary objectives of this project are to:

- Simplify the creation, management, and tracking of laundry orders.
- Provide transparent washing and ironing prices with automatic bill calculation.
- Support flexible garment quantities without imposing arbitrary minimum-order requirements.
- Maintain a clear record of order progress from receipt to delivery.
- Organize doorstep pickup and delivery information.
- Track garment quantities received, processed, and delivered.
- Identify and display recorded garment quantity discrepancies for investigation.
- Maintain application data locally so that records persist across application restarts.
- Develop a usable, consistent, and reliable desktop interface.

## 4. Planned Core Features

All features listed below are planned and have not yet been implemented.

### 4.1 Dashboard

A central dashboard summarizing operational information, including total orders, orders in progress, orders ready for delivery, relevant pickup and delivery activity, revenue calculated from recorded orders, and garment discrepancies requiring attention.

### 4.2 Laundry Order Management

The application is planned to support:

- Creating laundry orders with unique order identifiers.
- Recording customer and contact information.
- Adding garment types and quantities.
- Selecting washing and ironing services.
- Viewing and editing order details.
- Searching and filtering existing orders.
- Updating order information and status.

### 4.3 Transparent Pricing and Billing

The pricing module will aim to provide:

- Clearly defined prices for applicable garment types and services.
- Separate washing and ironing charges where applicable.
- Flexible order quantities.
- Automatic subtotal and total calculations.
- A clear bill or receipt for each order.

Minimum-order restrictions will not be imposed unless explicitly required by the business configuration.

### 4.4 Order Status Tracking

Orders will follow a defined laundry workflow:

**Received → Washing → Ironing → Ready for Delivery → Delivered**

The interface will display each order's current status and support appropriate status updates.

### 4.5 Garment Quantity Tracking and Loss Prevention

Garment management is a defining feature of the project.

The application is planned to record garment types and quantities received for each order, along with quantities processed and delivered where applicable.

It will identify recorded discrepancies, such as:

- A mismatch between quantities received and processed.
- Fewer garments delivered than expected.
- Differences between expected and actual garment quantities.

Warnings will identify the affected order and garment type to support investigation and accountability.

The system is intended to help detect recorded discrepancies and reduce the risk of undetected garment loss. It cannot guarantee that every instance of garment loss or damage will be prevented.

### 4.6 Doorstep Pickup and Delivery

The application will aim to organize pickup and delivery information, including:

- Customer addresses and location notes.
- Pickup and delivery instructions.
- Scheduled dates or times, where implemented.
- Relevant pickup and delivery status information.

External maps integrations and real-time location tracking are outside the initial planned scope.

### 4.7 Local Data Persistence

The application will require persistent local storage for orders, garment records, pricing information, and other necessary application data.

The persistence mechanism has not yet been selected or implemented. The final choice will prioritize simplicity, reliability, and suitability for a local desktop application.

## 5. Technology Stack

The planned technology stack is:

| Technology | Intended Purpose |
|---|---|
| React | Building the user interface with reusable components |
| Vite | Development server and frontend build tooling |
| Electron | Desktop application runtime and main-process functionality |
| JavaScript | Application logic and Electron integration |
| JSX | Defining React UI components |
| CSS | Styling and layout |
| Electron preload scripts | Exposing narrowly scoped functionality to the renderer |
| Electron IPC | Communication between the React renderer and Electron main process |
| Local persistence | Storing application data between sessions; implementation to be decided |
| electron-builder | Planned tooling for macOS `.dmg` packaging |
| Git and GitHub | Version control and source-code management |

## 6. Proposed Architecture

The application will use a React renderer and Electron's desktop application architecture.

### React Renderer

Responsible for the visible interface, including the dashboard, order forms, order lists, pricing displays, garment records, and discrepancy warnings.

### Electron Main Process

Responsible for the desktop application lifecycle, window management, and approved privileged operations, including access to local application data.

### Preload Script

Provides a controlled bridge between the renderer and main process. Only explicitly required operations will be exposed to React.

### Inter-Process Communication (IPC)

Allows the renderer to request supported operations from the main process, such as loading saved orders or saving an updated order.

### Local Persistence Layer

Will manage the storage and retrieval of application data. The implementation will be chosen during development.

### Security Approach

The application is planned to follow basic Electron security practices:

- Keep `nodeIntegration` disabled in the renderer.
- Enable `contextIsolation`.
- Avoid exposing unrestricted Node.js or filesystem access to React.
- Expose only necessary functions through the preload script.
- Validate important inputs and operations at appropriate boundaries.

The proposed communication flow is:

**React Renderer ↔ Preload Script and IPC ↔ Electron Main Process ↔ Local Persistence**

## 7. Development and Testing Approach

Development will proceed incrementally, with each stage implemented and tested before moving to the next.

The planned sequence is:

1. Create the initial project documentation.
2. Set up the React + Vite and Electron development environment.
3. Configure the main process, preload script, and secure IPC communication.
4. Build the initial application window and navigation.
5. Implement laundry order creation, editing, viewing, searching, and filtering.
6. Add transparent pricing and automatic bill calculations.
7. Implement order status tracking.
8. Add garment quantity tracking and discrepancy detection.
9. Implement local data persistence.
10. Build dashboard summaries using actual application data.
11. Add input validation, error handling, and usability improvements.
12. Test core workflows, persistence, and discrepancy calculations.
13. Prepare documentation and package the application as a macOS `.dmg`.

Testing will include normal workflows, invalid inputs, boundary cases, data persistence after restarting the application, and verification of the packaged application where possible.

Git commits will be created throughout development to document meaningful implementation milestones and fixes.

## 8. Setup and Run Instructions

**Status: To be added after project setup.**

The commands required to install dependencies, start the development environment, run the application, build the production version, and package the macOS `.dmg` will be documented after the project structure and tooling have been configured and verified.

## 9. Project Repository

GitHub repository:

[smart-laundry-management-system](https://github.com/Aadarsh-Lekhwani-26/smart-laundry-management-system)

## 10. Current Project Status

**Current stage: Initial documentation**

The project is in its initial documentation stage. The application implementation has not yet started.

| Component | Status |
|---|---|
| Project problem statement and objectives | Defined |
| Initial README | In preparation |
| React + Vite setup | Not started |
| Electron integration | Not started |
| User interface | Not started |
| Order management | Not started |
| Pricing and billing | Not started |
| Order status tracking | Not started |
| Garment quantity tracking | Not started |
| Local data persistence | Not started |
| Automated or manual application testing | Not started |
| macOS `.dmg` packaging | Not started |

These statuses will be updated as development progresses. No application features, tests, or packaged builds are claimed to be complete at this stage.

## 11. Expected Outcome

The intended outcome is a functional desktop application that helps a laundry business manage orders, communicate pricing clearly, coordinate pickup and delivery, track garment quantities, and identify recorded discrepancies.

The project will prioritize a complete, understandable, and reliable implementation over unnecessary complexity, with development decisions documented through meaningful Git commits.