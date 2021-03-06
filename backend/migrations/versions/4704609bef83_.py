"""empty message

Revision ID: 4704609bef83
Revises: d98d534f24b9
Create Date: 2020-06-16 06:40:36.383432

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4704609bef83'
down_revision = 'd98d534f24b9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('timetable', sa.Column('end_time', sa.String(), nullable=True))
    op.add_column('timetable', sa.Column('start_time', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('timetable', 'start_time')
    op.drop_column('timetable', 'end_time')
    # ### end Alembic commands ###
