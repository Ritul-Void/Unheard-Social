## Unheard-Social

Unheard is an experimental anonymous micro-social platform focused on sharing experiences without identity pressure or attention metrics. The system uses a service-key based authentication model instead of emails or passwords, allowing users to create accounts instantly while maintaining privacy. The project demonstrates a full-stack architecture using React for the frontend and Supabase (PostgreSQL + API) for the backend, with a minimal and extensible design intended for future moderation, machine learning filtering, and customizable user experiences.

Features

• Anonymous account creation using a 25-character service key

• JSON service key file export/import for fast login and backup

• React frontend deployed on Cloudflare Pages

• Supabase backend with PostgreSQL database

• Database schema with tables:
	- users
	- posts
	- comments
	- relates

• Post creation system
	- Post title
	- Post body
	- Timestamped posts

• Chronological feed
	- Latest posts first
	- Client-side sorting

• Relate interaction
	- Alternative to "likes"
	- Stored per user in relates table
	- Prevents duplicate relates

• Full comment system
	- Threaded replies using parent_comment_id
	- Dedicated post view

• Profile page
	- Generated avatar from avatar seed
	- User post list
	- Post count and relate statistics

• Permanent post deletion
	- Cascade deletes comments and relates
	- Privacy-first data removal

• Customizable UI settings
	- Primary and secondary colors
	- Font size accessibility options
	- Navigation bar style (full bar or floating pill)

• Client-side preference storage
	- Settings saved in localStorage

• Responsive mobile-first interface

• Minimal architecture designed for extension
	- future moderation system
	- reporting tools
	- ML-based content analysis
	- feed ranking algorithm
