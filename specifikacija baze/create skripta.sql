CREATE TABLE [AdminUser]
( 
	[Username]           varchar(50)  NULL ,
	[Password]           varchar(80)  NULL ,
	[AdminUserId]        integer  NOT NULL ,
	CONSTRAINT [XPKAdminUser] PRIMARY KEY  CLUSTERED ([AdminUserId] ASC)
)
go

CREATE TABLE [Attachment]
( 
	[AttachmentId]       integer  IDENTITY ( 1,1 )  NOT NULL ,
	[FileName]           varchar(50)  NOT NULL ,
	[FileExtension]      varchar(20)  NOT NULL ,
	[Content]            varbinary(max)  NOT NULL ,
	[MessageId]          integer  NOT NULL ,
	CONSTRAINT [XPKAttachment] PRIMARY KEY  CLUSTERED ([AttachmentId] ASC)
)
go

CREATE TABLE [FriendRequest]
( 
	[SenderId]           integer  NOT NULL ,
	[ReceiverId]         integer  NOT NULL ,
	[Resolved]           bit  NOT NULL 
	CONSTRAINT [Resolved_Default_Value]
		 DEFAULT  0,
	[Seen]               bit  NOT NULL 
	CONSTRAINT [Seen_Default_Value]
		 DEFAULT  0,
	[TimeStamp]          datetime  NOT NULL ,
	CONSTRAINT [XPKFriendRequest] PRIMARY KEY  CLUSTERED ([SenderId] ASC,[ReceiverId] ASC)
)
go

CREATE TABLE [Friendship]
( 
	[User1]              integer  NOT NULL ,
	[User2]              integer  NOT NULL ,
	CONSTRAINT [XPKFriendship] PRIMARY KEY  CLUSTERED ([User2] ASC,[User1] ASC)
)
go

CREATE TABLE [Group]
( 
	[GroupId]            integer  IDENTITY ( 1,1 )  NOT NULL ,
	[Name]               varchar(50)  NOT NULL ,
	[TimeStamp]          datetime  NOT NULL ,
	[Picture]            varbinary(max)  NULL ,
	[PictureType]        varchar(20)  NULL ,
	[IsBinary]           bit  NOT NULL 
	CONSTRAINT [IsBinary_Default_Value]
		 DEFAULT  1,
	CONSTRAINT [XPKGroup] PRIMARY KEY  CLUSTERED ([GroupId] ASC)
)
go

CREATE TABLE [GroupMember]
( 
	[UserId]             integer  NOT NULL ,
	[GroupId]            integer  NOT NULL ,
	[IsAdmin]            bit  NOT NULL 
	CONSTRAINT [IsAdmin_Default_Value]
		 DEFAULT  0,
	CONSTRAINT [XPKGroupMember] PRIMARY KEY  CLUSTERED ([UserId] ASC,[GroupId] ASC)
)
go

CREATE TABLE [Message]
( 
	[MessageId]          integer  NOT NULL ,
	[GroupId]            integer  NOT NULL ,
	[SenderId]           integer  NOT NULL ,
	[Datetime]           datetime  NULL ,
	[Text]               varchar(255)  NULL ,
	CONSTRAINT [XPKMessage] PRIMARY KEY  CLUSTERED ([MessageId] ASC)
)
go

CREATE TABLE [MessageCryptoMaterial]
( 
	[MessageCryptoMaterialId] integer  NOT NULL ,
	[Material]           varchar(255)  NULL ,
	[MessageId]          integer  NOT NULL ,
	[UserId]             integer  NOT NULL ,
	CONSTRAINT [XPKMessageCryptoMaterial] PRIMARY KEY  CLUSTERED ([MessageCryptoMaterialId] ASC)
)
go

CREATE TABLE [MessageRead]
( 
	[UserId]             integer  NOT NULL ,
	[MessageId]          integer  NOT NULL ,
	CONSTRAINT [XPKMessageRead] PRIMARY KEY  CLUSTERED ([UserId] ASC,[MessageId] ASC)
)
go

CREATE TABLE [User]
( 
	[UserId]             integer  IDENTITY ( 1,1 )  NOT NULL ,
	[Name]               varchar(50)  NOT NULL ,
	[CertHash]           varchar(20)  NOT NULL ,
	[Certificate]        binary(8000)  NOT NULL ,
	[Picture]            varbinary(max)  NULL ,
	[PictureType]        varchar(20)  NULL ,
	[RtId]               varchar(200)  NULL ,
	[BannedUntil]        datetime  NULL ,
	CONSTRAINT [XPKUser] PRIMARY KEY  CLUSTERED ([UserId] ASC),
	CONSTRAINT [CertHash_Unique] UNIQUE ([CertHash]  ASC)
)
go


ALTER TABLE [Attachment]
	ADD CONSTRAINT [R_8] FOREIGN KEY ([MessageId]) REFERENCES [Message]([MessageId])
		ON DELETE CASCADE
		ON UPDATE NO ACTION
go


ALTER TABLE [FriendRequest]
	ADD CONSTRAINT [R_5] FOREIGN KEY ([SenderId]) REFERENCES [User]([UserId])
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
go

ALTER TABLE [FriendRequest]
	ADD CONSTRAINT [R_7] FOREIGN KEY ([ReceiverId]) REFERENCES [User]([UserId])
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
go


ALTER TABLE [Friendship]
	ADD CONSTRAINT [R_13] FOREIGN KEY ([User1]) REFERENCES [User]([UserId])
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
go

ALTER TABLE [Friendship]
	ADD CONSTRAINT [R_14] FOREIGN KEY ([User2]) REFERENCES [User]([UserId])
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
go


ALTER TABLE [GroupMember]
	ADD CONSTRAINT [R_1] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId])
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
go

ALTER TABLE [GroupMember]
	ADD CONSTRAINT [R_2] FOREIGN KEY ([GroupId]) REFERENCES [Group]([GroupId])
		ON DELETE CASCADE
		ON UPDATE NO ACTION
go


ALTER TABLE [Message]
	ADD CONSTRAINT [R_11] FOREIGN KEY ([GroupId]) REFERENCES [Group]([GroupId])
		ON DELETE CASCADE
		ON UPDATE NO ACTION
go

ALTER TABLE [Message]
	ADD CONSTRAINT [R_12] FOREIGN KEY ([SenderId]) REFERENCES [User]([UserId])
		ON DELETE CASCADE
		ON UPDATE NO ACTION
go


ALTER TABLE [MessageCryptoMaterial]
	ADD CONSTRAINT [R_9] FOREIGN KEY ([MessageId]) REFERENCES [Message]([MessageId])
		ON DELETE CASCADE
		ON UPDATE NO ACTION
go

ALTER TABLE [MessageCryptoMaterial]
	ADD CONSTRAINT [R_10] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId])
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
go


ALTER TABLE [MessageRead]
	ADD CONSTRAINT [R_3] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId])
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
go

ALTER TABLE [MessageRead]
	ADD CONSTRAINT [R_4] FOREIGN KEY ([MessageId]) REFERENCES [Message]([MessageId])
		ON DELETE CASCADE
		ON UPDATE NO ACTION
go
