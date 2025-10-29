from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Click(Base):
    __tablename__ = "clicks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ip = Column(String(45), nullable=True)  # 45 символів — IPv6 сумісність
    uuid_link = Column(String(255), unique=True, nullable=False)
    country = Column(String(100), nullable=True)
    region = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    zip = Column(String(20), nullable=True)
    lat = Column(String(50), nullable=True)
    lon = Column(String(50), nullable=True)
    timezone = Column(String(100), nullable=True)
    isp = Column(String(100), nullable=True)
    org = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True),
                        server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(
    ), onupdate=func.now(), nullable=False)
    total_clicks = Column(Integer, nullable=False, default=0)

    def __repr__(self):
        return f"<Click(id={self.id}, ip={self.ip}, uuid_link={self.uuid_link}, total_clicks={self.total_clicks})>"
