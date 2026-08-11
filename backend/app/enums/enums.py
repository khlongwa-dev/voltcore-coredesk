import enum

class Role(str, enum.Enum):
    employee = "employee"
    agent = "agent"
    admin = "admin"

class Office(str, enum.Enum):
    durban = "durban"
    johannesburg = "johannesburg"

class Category(str, enum.Enum):
    hardware = "hardware"
    software = "software"
    network = "network"
    account = "access"
    other = "other"

class Priority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class Status(str, enum.Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"

class Event(str, enum.Enum):
    created = "created"
    assigned = "assigned"
    reassigned = "reassigned"
    status_changed = "status_changed"
    commented = "commented"
    resolved = "resolved"
    closed = "closed"

class Department(str, enum.Enum):
    executive = "Executive"
    finance = "Finance"
    hr = "HR"
    it = "IT"
    electrical_engineering = "Electrical_Engineering"
    industrial_automation = "Industrial_Automation"
    field_operations = "Field_Operations"
    sales = "Sales"

class Channel(str, enum.Enum):
    ntfy = "ntfy"
    email = "email"
    sms = "sms"